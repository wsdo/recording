import InlineWorker from 'inline-worker';

export class Recorder {
    config = {
        bufferLen: 4096,
        numChannels: 2,
        mimeType: 'audio/mp3'
    };

    recording = false;

    callbacks = {
        getBuffer: [],
        exportAudio: []
    };

    constructor(source, cfg) {
        Object.assign(this.config, cfg);
        this.context = source.context;
        this.node = (this.context.createScriptProcessor ||
        this.context.createJavaScriptNode).call(this.context,
            this.config.bufferLen, this.config.numChannels, this.config.numChannels);

        this.node.onaudioprocess = (e) => {
            if (!this.recording) return;
            var buffer = e.inputBuffer.getChannelData(0)
            this.worker.postMessage({
                command: 'record',
                buffer: buffer
            });
        };

        source.connect(this.node);
        this.node.connect(this.context.destination);

        let self = {};
        this.worker = new InlineWorker(function () {
            importScripts('https://cdn.bootcss.com/lamejs/1.2.0/lame.min.js');
            var mp3Encoder, maxSamples = 1152, samplesMono, lame, config, dataBuffer = [];

            let recLength = 0,
                recBuffers = [],
                sampleRate,
                numChannels;

            this.onmessage = function (e) {
                switch (e.data.command) {
                    case 'init':
                        init(e.data.config);
                        break;
                    case 'record':
                        record(e.data.buffer);
                        break;
                    case 'exportAudio':
                        exportAudio(e.data.type);
                        break;
                    case 'getBuffer':
                        getBuffer();
                        break;
                    case 'clear':
                        clear();
                        break;
                }
            };

            function init(config) {
                sampleRate = config.sampleRate;
                numChannels = config.numChannels;
                initBuffers();
                lame = lamejs;
                mp3Encoder = new lame.Mp3Encoder(1, config.sampleRate || 44100, config.bitRate || 128);

            }

            function clearBuffer() {
                dataBuffer = [];
            };

            function appendToBuffer(mp3Buf) {
                dataBuffer.push(new Int8Array(mp3Buf));
            };

            function record(inputBuffer) {
                samplesMono = convertBuffer(inputBuffer);

                var remaining = samplesMono.length;
                for (var i = 0; remaining >= 0; i += maxSamples) {
                    var left = samplesMono.subarray(i, i + maxSamples);
                    var mp3buf = mp3Encoder.encodeBuffer(left);
                    appendToBuffer(mp3buf);
                    remaining -= maxSamples;
                }
            }

            function convertBuffer(arrayBuffer) {
                var data = new Float32Array(arrayBuffer);
                var out = new Int16Array(arrayBuffer.length);
                floatTo16BitPCM(data, out);
                return out;
            };

            function floatTo16BitPCM(input, output) {
                for (var i = 0; i < input.length; i++) {
                    var s = Math.max(-1, Math.min(1, input[i]));
                    output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
                }
            };

            function exportAudio(type) {
                appendToBuffer(mp3Encoder.flush());
                // 在这填写二进制文件
                let audioBlob = new Blob(dataBuffer, {type: type});
                this.postMessage({command: 'exportAudio', data: audioBlob});
            }

            function getBuffer() {
                let buffers = [];
                for (let channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                }
                this.postMessage({command: 'getBuffer', data: buffers});
            }

            function clear() {
                recLength = 0;
                recBuffers = [];
                dataBuffer = [];
                initBuffers();
            }

            function initBuffers() {
                for (let channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel] = [];
                }
            }

            function mergeBuffers(recBuffers, recLength) {
                let result = new Float32Array(recLength);
                let offset = 0;
                for (let i = 0; i < recBuffers.length; i++) {
                    result.set(recBuffers[i], offset);
                    offset += recBuffers[i].length;
                }
                return result;
            }

            function interleave(inputL, inputR) {
                let length = inputL.length + inputR.length;
                let result = new Float32Array(length);

                let index = 0,
                    inputIndex = 0;

                while (index < length) {
                    result[index++] = inputL[inputIndex];
                    result[index++] = inputR[inputIndex];
                    inputIndex++;
                }
                return result;
            }
            function writeString(view, offset, string) {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }
        }, self);

        this.worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                numChannels: this.config.numChannels
            }
        });

        this.worker.onmessage = (e) => {
            let cb = this.callbacks[e.data.command].pop();
            if (typeof cb == 'function') {
                cb(e.data.data);
            }
        };
    }


    record() {
        this.recording = true;
    }

    stop() {
        this.recording = false;
    }

    clear() {
        this.worker.postMessage({command: 'clear'});
    }

    getBuffer(cb) {
        cb = cb || this.config.callback;
        if (!cb) throw new Error('Callback not set');
        this.callbacks.getBuffer.push(cb);
        this.worker.postMessage({command: 'getBuffer'});
    }

    exportAudio(cb, mimeType) {
        mimeType = mimeType || this.config.mimeType;
        cb = cb || this.config.callback;
        if (!cb) throw new Error('Callback not set');
        
        this.callbacks.exportAudio.push(cb);
        this.worker.postMessage({
            command: 'exportAudio',
            type: mimeType
        });
    }

    static
    forceDownload(blob, filename) {
        let url = (window.URL || window.webkitURL).createObjectURL(blob);
        let link = window.document.createElement('a');
        link.href = url;
        link.download = filename || 'output.mp3';
        let click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
    }
}

export default Recorder;
