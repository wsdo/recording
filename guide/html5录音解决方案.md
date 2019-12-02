## html5录音解决方案
### 方式
> 使用html5技术实现录音功能,在浏览器里面运行

### 场景

> 常用场景
  * 微信 
  * APP 
  * 普通浏览器 
  * 手机QQ

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


## 技术实现方案
### 技术栈
* react 
* redux

### 实现思路
实现兼容三个场景的录音组件
对外暴露开始和结束的方法接口
返回：
* 真实的静态服务器的mp3地址文件 用来提交到数据库的文件地址
* 本地播放的mp3或wmv格式文件 用来`我的按钮`来播放

内部组件实现：
  当外部调用组件开始方法的时候，调用内部录音的函数，每个端都有自己的方式
  暂停的时候，把录音的数据流，转换成本地的localurl 返回，用来播放，app 和 微信，返回localid



### 实战前先了解一下历史
> 先了解一下简介和历史吧

###  简介
长久以来，音频/视频捕获都是网络开发中的“圣杯”。
多年来，我们总是依赖于浏览器插件（Flash 或 Silverlight）实现这一点。快来看看吧！

现在轮到 HTML5 大显身手了。也许看起来不是很显眼，但是 HTML5 的崛起引发了对设备硬件访问的激增。
地理位置 (GPS)、Orientation API（加速计）、WebGL (GPU) 和 Web Audio API（视频硬件）都是很好的例子。
这些功能非常强大，展示了基于系统底层硬件功能之上的高级 JavaScript API。

本教程介绍了一种新 API：navigator.getUserMedia()，可让网络应用访问用户的相机和麦克风。

### 了解 getUserMedia() 的历史 (节选 Capturing Audio & Video in HTML5)
如果您还不知道，getUserMedia() 的历史可谓一段有趣的故事。

过去几年中出现过好几种“Media Capture API”的变体。很多人意识到，需要能够在网络上访问本地设备，但这要所有人合力开发出一种新的规范。局面一片混乱，以至于 W3C 最终决定成立一个工作组。他们只有一个目的：理清混乱的局面！设备 API 政策 (DAP) 工作组负责对过剩的提议进行统一和标准化。

我会试着总结一下 2011 所发生的事情...

#### 第 1 轮：HTML 媒体捕获
HTML 媒体捕获是 DAP 在网络媒体捕获标准化上迈出的第一步。具体方法是超载 `<input type="file">` 并为 accept 参数添加新值。

如果您要让用户通过网络摄像头拍摄自己的快照，就可以使用 capture=camera：

```
<input type="file" accept="image/*;capture=camera">
```
录制视频或音频也是类似的：

```
<input type="file" accept="video/*;capture=camcorder">
<input type="file" accept="audio/*;capture=microphone">
```

#### 第 2 轮：设备元素
很多人认为 HTML 媒体捕获的局限性太大，因此一种新的规范应运而生，可以支持任何类型的（未来）设备。不出意料地，该设计需要新的 <device> 元素，也就是 getUserMedia() 的前身。

Opera 是第一批根据 <device> 元素创建视频捕获的初始实施的浏览器之一。不久之后（准确地说是同一天），WhatWG 决定废止 <device> 标记，以支持称为 navigator.getUserMedia() 的新兴 JavaScript API。一周后，Opera 推出的新版本中加入了对更新的 getUserMedia() 规范的支持。当年年底，Microsoft 也加入这一行列，发布了 IE9 实验室以支持新规范。

```
<device type="media" onchange="update(this.data)"></device>
<video autoplay></video>
<script>
  function update(stream) {
    document.querySelector('video').src = stream.url;
  }
</script>
```
很遗憾，已发布的浏览器中没有任何一款曾经包含 <device>。我猜这是一个不太需要担心的 API。但是 <device> 确实有两大优点：一是语义方面，二是可以轻松进行扩展，而不仅仅是支持音频/视频设备。

现在深吸一口气。这玩意儿速度飞快！

#### 第 3 轮：WebRTC  这就是今天讨论的重点了
<device> 元素最终还是像渡渡鸟一样销声匿迹了。

依靠 WebRTC（网络即时通信）的大力协助，最近几个月寻找合适捕获 API 的步伐加快了很多。该规范由 W3C WebRTC 工作组负责监管。Google、Opera、Mozilla 和其他一些公司目前正致力于在自己的浏览器中实施该 API。

getUserMedia() 与 WebRTC 相关，因为它是通向这组 API 的门户。它提供了访问用户本地相机/麦克风媒体流的手段。

支持：

在 Chrome 浏览器 18.0.1008 和更高版本中，可在 about:flags 下启用 WebRTC。


### html5录音具体实现，实现主要需要两个api
#### AudioContext
> AudioContext接口表示由音频模块连接而成的音频处理图，每个模块对应一个AudioNode。AudioContext可以控制它所包含的节点的创建，以及音频处理、解码操作的执行。做任何事情之前都要先创建AudioContext对象，因为一切都发生在这个环境之中。

> 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext
![](http://md.shudong.wang/stark-20180328185846464.png)
#### getUserMedia
> 使用 navigator.mediaDevices.getUserMedia 这个api实现
> 注意getUserMedia 这个api，有个新版和旧版前面多了 `mediaDevices`
> navigator.getUserMedia -> mediaDevices.getUserMedia

>MediaDevices.getUserMedia() 会提示用户给予使用媒体输入的许可，媒体输入会产生一个MediaStream，里面包含了请求的媒体类型的轨道。此流可以包含一个视频轨道（来自硬件或者虚拟视频源，比如相机、视频采集设备和屏幕共享服务等等）、一个音频轨道（同样来自硬件或虚拟音频源，比如麦克风、A/D转换器等等），也可能是其它轨道类型。

>它返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象。若用户拒绝了使用权限，或者需要的媒体源不可用，promise会reject回调一个  PermissionDeniedError 或者 NotFoundError 。
>参考
https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
![](http://md.shudong.wang/stark-20180328185819122.png)


### 处理音频就需要AudioContext

有很多api 函数需要，自己多去参考文档，实现demo方案，在后面放出来。

###  getUserMedia核心实现方式

```
navigator.mediaDevices.getUserMedia({ audio: true,viedo:true })  // 只处理音频
      .then(回调成功处理)
      .catch(回调失败处理);

onMicrophoneCaptured 录音成功处理的回调函数 参数是数据流
onMicrophoneCaptureError 失败时处理的回调
```



#### 简单处理视频的例子
```
navigator.mediaDevices.getUserMedia({ audio: true, video: true })
.then(function(stream) {
  var video = document.querySelector('video');
  // Older browsers may not have srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
```


### 实现音频的demo
> 可以使用这个html5demo案例 来测试浏览器是否兼容情况，再把代码放进框架。

demo 地址 https://shudong.wang/recorder/demo

### api 兼容的写法
####  引入 adapter  (在旧的浏览器中使用新的API) 【坑】
> 官方推荐的兼容方案，测试QQ浏览器不支持，报错，所以放弃了。
```
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
```

#### api兼容方案
这是一个使用 navigator.mediaDevices.getUserMedia()的例子，带一个polyfill以适应旧的浏览器。 要注意的是这个polyfill并不能修正一些约束语法上的遗留差异，这表示约束在某些浏览器上可能不会很好地运行。推荐使用处理了约束的 adapter.js polyfill 来替代。
https://github.com/webrtc/adapter



```
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia
```


```
/ 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
// 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // 首先，如果有getUserMedia的话，就获得它
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // 否则，为老的navigator.getUserMedia方法包裹一个Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

```

### 判断环境
> 根据环境切换不通react 组件
```
export const isWeixin = () => {
  return /MicroMessenger/i.test(navigator.userAgent)
}

export const isHJApp = () => {
  let res = false
  if (window.HJSDK && window.HJSDK.isContainer()) {
    res = true
  }
  return res
}

export const isHjIosApp = () => {
  return isHJApp() && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

```

### 判断是否兼容api
> 可以根据这个判断来给用户提示是否需要切换浏览器
```
export const checkAudioContext = () => {
  return !!(typeof window.AudioContext !== 'undefined' ||
    typeof webkitAudioContext !== 'undefined' ||
    typeof window.mozAudioContext !== 'undefined'
  )
}

export const checkGetUserMedia = () => {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia ||
    typeof navigator.mediaDevices !== 'undefined')
}

// 检测是否支持录音
export const isRecord = () => {
  // alert(checkAudioContext())

  return checkAudioContext() && checkGetUserMedia()
}
```
### 处理 Safari 兼容 （坑点）
> safari 不支持Buffer的方式改为下面这种
> 需要把传进来来的异步worker 用函数包裹。

```

function(){ 
  处理的worker 内容
}

```

> 处理worker兼容 generateWorker

```
// Utilities for generating workers
function stringifyFunction(func) {
  // 把代码格式化成字符串
  return '(' + func + ').call(self);'
}

export function generateWorker(code) {
  // URL.createObjectURL
  let blob, worker, windowURL
  var stringified = stringifyFunction(code);
  windowURL = window.URL || window.webkitURL;
  try {
    blob = new Blob([stringified], { type: 'application/javascript' });
  } catch (e) { // 兼容
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new BlobBuilder()
    blob.append(stringified)
    blob = blob.getBlob()
  }

  if ("Worker" in window) {
    worker = new Worker(windowURL.createObjectURL(blob))
  } else {
    console.log('====================================')
    console.log("不支持worker")
    console.log('====================================')
    // worker = new FakeWorker(code);
  }
  return worker;
}

```

## 项目实战过程
> 目录

![2018-04-11-16-30-00](http://md.shudong.wang/2018-04-11-16-30-00.png)

* recordApp  app 端组件
* recordWx   wx 端组件
* recordGeneral  普通浏览器
* recordGate  处理的闸门 根据环境切换不同的组件

### 普通浏览器处理音频细节
参考 https://shudong.wang/recorder/demo


### App端处理


#### 录音开始调用 app的开始录音api接口
```
  start = () => {
    HJSDK.invoke('file_startRecord', this.record)
  }
```
#### 录音暂停
```
  stop = () => {
    let self = this
    const { localSrc } = this.props
    HJSDK.invoke('file_stopRecord', {
      success: function (res) {
        //把录制好的localid 返回
        localSrc(res.localIds)

        //上传本地的localid 到静态文件服务器
        self.uploadVoice(res.localIds)

        self.setState({
          appLocalId: res.localIds
        })
      },
      fail: function (res) {
        console.log('====================================')
        console.log('APP录音结束失败', res)
        console.log('====================================')
      }
    }, this.stopRecord)
  }
```

#### APP语音上传
```
  uploadVoice = (appLocalId) => {
    let self = this
    const { onStop } = this.props
    HJSDK.invoke("file_uploadAudio", {
      uri: appLocalId, //音频localid
      success: function (data) {
        // 把获取上传成功的url传输到前面
        onStop(data.url)
      },// 上传成功后调用的方法，将url传给web端
      fail: function (data) {
        alert(data.message)
        console.log('====================================')
        console.log(data)
        console.log('====================================')
      }
    }, self.vcallback)
  }
```
#### APP语音下载

```
  downloadVoice = (serverId) => {
    wx.downloadVoice({
      serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        var localId = res.localId; // 返回音频的本地ID
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  }
```

### 微信端处理方式
> 逻辑和 app 类似
> 不同点本地的local 不能直接播放，需要单独处理，获取静态服务器mp3文件需要单独处理一下
```
// 微信录音：
//   录音开始
//   录音结束
//   录音结束后把录制的原始音频返回

  start = () => {
    console.log('====================================')
    console.log('微信录音开始')
    console.log('====================================')
    window.wx.startRecord({
      cancel: function () {
        alert('用户拒绝授权录音');
      },
      success: function () {
        alert('开始录音')
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    })
  }

  stop = () => {
    let self = this
    console.log('====================================')
    console.log('微信录音结束')
    console.log('====================================')
    wx.stopRecord({
      success: function (res) {
        alert("停止录音成功")
        alert(res.localId)
        self.uploadVoice(res.localId)
        self.setState({
          wxLocalId: res.localId
        })
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  }


  // 微信语音上传
  uploadVoice = (wxLocalId) => {
    alert('微信语音正在上传')
    let self = this
    wx.uploadVoice({
      localId: wxLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        self.downloadVoice(res.serverId)
        self.setState({
          wxServerId: res.serverId // 返回音频的服务器端ID
        })
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  }

  // 微信语音下载
  downloadVoice = (serverId) => {
    wx.downloadVoice({
      serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        var localId = res.localId; // 返回音频的本地ID
        alert('微信语音下载成功')
        alert(localId)
        console.log('====================================')
        console.log('微信服务器语音id',localId)
        console.log('====================================')
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  }

```

### end
上面讲了一下坑和实现思路和具体场景下的方案，app 和 微信 调用它们本身的api，普通的浏览器用原生的来写，网上也有很多实现方案，放了一个demo可以参考。
