webrtc-adapter qq浏览器不支持
![2018-04-09-12-12-13](http://md.shudong.wang/2018-04-09-12-12-13.png)


## 录音方案记录

## 兼容问题

浏览器 | 版本 | mac | 安卓 | ios | 
----|----|-----|----|-----|-
Chrome | 最新版 | 兼容 | 兼容 | 不兼容
QQ浏览器 | 最新版 | 兼容 | 不兼容 
手机QQ | 最新版 | 不需要 支持 | 不支持



浏览器 | 版本 | mac | 安卓 | ios | 
----|----|-----|----|-----|-
Chrome | 最新版 | 兼容 | 兼容 | 不兼容
QQ浏览器 | 最新版 | 兼容 




同样问题
不支持 navigator.getUserMedia
不支持 navigator.mediaDevices.getUserMedia
新旧api 都不支持

影响到以下浏览器

Chrome ios 版本 不支持 getUserMedia  
手机QQ ios 版本 不支持 getUserMedia
QQ浏览器 ios 版本 不支持 getUserMedia



6rY2iGA5ZvXkvuY0sRkI1JK-peKUcZ9pzpEWqVI2vOOp3IzVeRMCeSWld4uUuZLt


https://api.weixin.qq.com/cgi-bin/media/get?access_token=8_zHtDG_UD_7GvVTjdphCgJmgx66bE_d0-KKc8hHZ1LayMrEPC_MFTRVfFWHdtrTMIZ6mreMkx5SgxRDBYAQFLhdsph_tFpSRfSRYcIvsUeqkmkGm3Gq_AXf77OZfRPX6Yh7YxljrsEY2QMKBTCRBfAJAQFP&media_id=6rY2iGA5ZvXkvuY0sRkI1JK-peKUcZ9pzpEWqVI2vOOp3IzVeRMCeSWld4uUuZLt


在QQ浏览器上面报 

{"name":"NotAllowedError","message":"","constraint":""}

## 接口地址
2018年04月19日10:22:58 接口写完
http://wiki.yeshj.com/pages/viewpage.action?pageId=44584553


测试：
qagw-ebase-by.intra.yeshj.com/file

qagw-ebase-by.intra.yeshj.com/file


## todo
### bug 
  * [ ] 如果出现不兼容的情况，pc端提示文案
  * [x] 我的 需要点击两次
  * [ ] 在QQ浏览器上面 需要监听回调才能判断不支持
  * [x] 两道口语题下一步 我的按钮还是绿色
  * [ ] 判断是否支持worker
  * [ ] 判断异常情况
  * [ ] oppo 测试录音没问题 ：点击选项不显示



## 测试记录：
  ios 
    手机 Safari ok
    app 浏览器包含 ok

  安卓：
    QQ环境里面没问题
    oppo 测试录音没问题 ：点击选项不显示

win：
  * 360安全浏览器 可以使用
  * 360极速浏览器不支持  提示更换最新Chrome
  * 谷歌最新版可以使用
  * 火狐最新版可以使用
  * ie 不可以使用 提示更换最新 Chrome
  * 自带的edge的 支持
  
  * 搜狗高速浏览器 不支持： 报错 unhandled promise rejection 
  * QQ浏览器 测试没问题

记录：
  app 可以直接播放本地文件
  微信不可以 需要上传完成再播放


2018年04月25日17:24:43

qa环境：
  bug:
  mac Safari 浏览器 第二个录音题，会出现，录音没有声音。
  微信不支持

