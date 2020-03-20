## h5 录音组件
### 兼容问题
  > h5录音主要使用AudioContext 和 getUserMedia 兼容性还是很差的，尤其是在移动端。

  > AudioContext

  ![](http://md.shudong.wang/stark-20180328182534827.png)
  > getUserMedia

  ![](http://md.shudong.wang/stark-20180328182615649.png)

#### ios端支持情况 
> Chrome 浏览器，QQ浏览器， （safari 除外）几乎都不支持

  同样问题：
  不支持 navigator.getUserMedia
  不支持 navigator.mediaDevices.getUserMedia
  不支持 navigator.mediaDevices

  影响到以下浏览器 （除了safari 外）

  ios Chrome 不支持 getUserMedia  
  ios 手机QQ 不支持 getUserMedia
  ios QQ浏览器 不支持 getUserMedia
  ios uc浏览器 不支持 getUserMedia

#### 安卓端支持情况
> Chrome 支持友好

#### 汇总支持情况表格

2018年04月11日 测试情况

```
请忽略，看下面表格（预留格式，可以使用markdown格式化表格）

浏览器    版本    mac  安卓  ios  
Chrome   最新版  兼容  兼容  不兼容
QQ浏览器  最新版  兼容  不兼容  不兼容
手机QQ    最新版  不需要  支持  不支持
uc浏览器  最新版  不需要  支持  不支持

```

> 格式化后的表格

浏览器 | 版本 | mac | 安卓 | ios | 
----|----|-----|----|-----|-
Chrome | 最新版 | 兼容 | 兼容 | 不兼容
QQ浏览器 | 最新版 | 兼容 | 不兼容 | 不兼容
手机QQ | 最新版 | 不需要 | 支持 | 不支持
uc浏览器 | 最新版 | 不需要 | 支持 | 不支持

### 兼容方案
> 开发的时候分别照顾到以上的场景，
* 如果在html5嵌入到app端，调用app的api即可
* 如果在微信的场景，直接调用微信里面的录音api
* 如果是普通的浏览器，尽量把兼容的方式写好

## 测试记录
苹果手机需要内核大于 webkit > 605 Safari 才支持

> ios目前只有Safari 支持
## 支持格式
  目前仅支持mp3格式
  后期会支持wav格式
## 测试demo
> 先把demo把需要应用的场景测试一遍,再进行业务开发
### 测试地址
https://shudong.wang/recorder/demo

## 选项
```
    import Recorder from 'recorder'

    配置：
    const config = {
      sampleRate: 采样率：默认：44100,
      bitRate: 比特率默认：128
    }

    new Recorder(this.microphone, config)
```
### 开始录制
```
  this.recorder.record()
```

### 停止录制
```
this.recorder.stop()
```

### 清除
```
this.recorder.clear()
```

### 停止录制完回调mp3
```
recorder.exportAudio((blob) => {
  var url = URL.createObjectURL(blob);
  //在此处上传到静态服务器
});
```


## 使用方式
### 普通demo

```
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(startUserMedia)
  .catch(errorHandler)

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);

    var config = {
      sampleRate: 16000,
      bitRate: 16
    };

    recorder = new Recorder(input,config);
  }

  function startRecording() {
    recorder && recorder.record();
  }

  function stopRecording() {
    recorder && recorder.stop();
    recorder && recorder.exportAudio(function(blob) {
      var url = URL.createObjectURL(blob);
    });
    recorder && recorder.clear();
  }
```
### in react demo
```
import recorder from 'h5-recording'

componentWillMount() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(this.sucessHandler)
      .catch(this.errorHandler)
  }
  componentWillUnmount() {
    this.audioContext.close()
    this.recorder.clear()
  }

  getAudioContext = () => (
    window.AudioContext ||
    window.webkitAudioContext
  )

  start = () => {
    this.recorder.record()
  }

  stop = () => {
    this.recorder.stop()
    this.recorder.exportAudio(function (blob) {
      var url = URL.createObjectURL(blob);
      //在此处上传
    });
    this.recorder.clear()
  }

  sucessHandler = (stream) => {
    this.microphone = this.audioContext.createMediaStreamSource(stream)
    const config = {
      sampleRate: DEFAULT_SAMPLE_RATE,
      bitRate: DEFAULT_BIT_RATE
    }
    this.recorder = new StarkRecorderJs(this.microphone, config)
  }

  errorHandler = (error) => {
    const { onError } = this.props
    onError(error)
  }
```
