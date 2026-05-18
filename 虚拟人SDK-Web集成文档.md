修订文档历史记录  


| **日期** | **版本** | **说明** | **作者** |
| --- | --- | --- | --- |
| 2024 | 3.0.0 | 虚拟人js sdk文档 | iflytek |
| 2024/09/29 | 3.0.4 | 1.解除android/ios限制， 但不支持的设备功能无法使用。   2. sdk 支持动作帧起始/结束事件   | iflytek |
| 2024/11/13 | 3.1.0 | 1.新增支持超拟人情感分析。 | iflytek |


# 1.概述
虚拟人 SDK是基于科大讯飞虚拟人相关能力进行融合和封装，以便为客户提供更便捷的接入方式，快速打造属于自己的虚拟人业务场景。

# 专有名词
<font style="color:rgb(0,0,0);">Avatar：虚拟人</font>

<font style="color:rgb(0,0,0);">tts：text-to-speech，语音合成</font>

<font style="color:rgb(0,0,0);">vc：voice-change 变声</font>

<font style="color:rgb(0,0,0);">asr：automatic-speech-recognition 语音识别</font>

<font style="color:rgb(0,0,0);">air：自动动作</font>

<font style="color:rgb(0,0,0);">nlp：natural-language-processin 自然语言处理即语义理解</font>

<font style="color:rgb(0,0,0);">全双工：实时语音识别和理解，实时交互的效果</font>

<font style="color:rgb(0,0,0);">打断：可打断虚拟人正在播报的文本，立刻开始下一轮交互</font>

<font style="color:rgb(0,0,0);">追加：不可打断虚拟人正在播报的文本，需等当前交互完毕后再开始下一轮交互</font>

# 2. 集成接入
## <font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);">接入条件</font>
## <font style="color:rgb(0,0,0);">2.1. 接入准备</font>
<font style="color:rgb(0,0,0);">由于虚拟人涉及多项能力，接入前请提前申请</font><font style="color:rgb(0,0,0);">AppId、ApiKey、ApiSecret、</font><font style="color:rgb(0,0,0);">形象、发音人、并发路数、有效期等相关授权信息。具体准备信息如下：</font>

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);">1、接⼝地址: wss://avatar.cn-huadong-1.xf-yun.com/v1/interact</font>

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);">2、分配的appid、apiKey、apiSecret和SceneId（接口服务ID）（到交互平台-接口服务中获取）</font>

[交互平台申请接口服务Appid.docx](https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1743094565343-4d92944e-aa84-4803-b08e-a475515f6768.docx)

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);">3、分配的avatar_id和vcn（到交互平台-接口服务-形象列表和声音列表中获取已授权的形象和声音，未授权的可点击”获取授权“）</font>

##  <font style="color:rgb(0,0,0);">2.2. demo和安装包下载</font>
websdk在安卓端或者移动设备上的游览器不保证都支持，由于没有覆盖所有的设备，不同设备的游览器内核都不一样，因此不保证都支持，websdk通常用在pc端以及大屏上; 不建议客户端 android /ios 套壳H5

[avatar-sdk-web.3.2.1.1016.zip](https://www.yuque.com/attachments/yuque/0/2026/zip/36139028/1768546935006-c1c71b2e-a9ed-44c5-bc8b-76e8fbc5688e.zip)

SDK是纯JS开发的，不挑框架。

[avatar-sdk-web_demo.zip](https://www.yuque.com/attachments/yuque/0/2024/zip/36139028/1734318021905-ef0ebd45-3ca5-45c1-9937-652c1db226df.zip)

**Vue2版本Demo**

git clone [https://gitee.com/wulong12345/web-sdk-vue2.git](https://gitee.com/wulong12345/web-sdk-vue2.git)

demo下载后，可以先看讲解视频，若有问题可以先看该文档最下方的常见报错以及常见需求场景的解决方案中寻找答案

**适配环境**

websdk通常用在windows、Linux等pc端以及大屏上，websdk在安卓端或者移动设备上的游览器不保证都支持，由于没有覆盖所有的设备，不同设备的游览器内核都不一样，因此不保证都支持，

**<font style="color:#000000;">demo运行讲解视频</font>**  
[https://www.bilibili.com/video/BV1aHLbzRE1c/](https://www.bilibili.com/video/BV1aHLbzRE1c/)

**<font style="color:#000000;">调用流程：</font>**

**<font style="color:#000000;">①、引入SDK实例，初始化SDK实例——></font>**

**<font style="color:#000000;">②、设置监听——></font>**

**<font style="color:#000000;">③、设置SDK配置（setApiInfo）——></font>**

**<font style="color:#000000;">④、设置全局变量（setGlobalParams）——></font>**

**<font style="color:#000000;">⑤、启动虚拟人（start）——></font>**

**<font style="color:#000000;">⑥、发送驱动协议（文本驱动/交互、音频驱动/交互、全双工语音实时交互、打断、动作驱动）——></font>**

**<font style="color:#000000;">⑦、断开连接</font>**

## 2.2. <font style="color:rgb(0,0,0);">集成步骤</font>及基础代码示例
### 2.2.1 导入模块
```javascript
import AvatarPlatform, {
  PlayerEvents,
  SDKEvents,
} from './sdk/3.1.2.1002/avatar-sdk-web_3.1.2.1002/index.js'
```

### 2.2.2 初始化SDK实例 （先创建实例）
| 属性 | 类型 | 必填 | 父节点 | 说明 |
| --- | --- | --- | --- | --- |
| props | IAvatarPlatformProps | <font style="color:#000000;">否</font> | root | 创建实例时 属性配置 |
| <font style="color:#000000;">useInlinePlayer</font> | <font style="color:#000000;">boolean</font> | <font style="color:#000000;">否</font> | <font style="color:#000000;">props</font> | <font style="color:#000000;">是否启用内置播放器； 默认true</font> |


形如： 

```javascript
// 创建实例 (默认使用内置播放 仅支持 xrtc/webrtc)
const avatarPlatform = new AvatarPlatform() 

```

### 2.2.3 设置事件监听
参考**2.3 事件**说明,** 按需** 进行相关事件监听, （下方为列出可绑定的的全量事件）

```javascript
// 可以选择性 按需 进行相关事件监听
avatarPlatform
      .on(SDKEvents.connected, (initResp: any) => {
        // 获取到拉流地址
        console.log('sdk event: connected', initResp)
      })
      .on(SDKEvents.stream_start, () => {
        // 引擎侧 首帧 推流开始 （注意：不代表端侧已经开始有画面！）
        console.log('sdk event: stream_start')
      })
      .on(SDKEvents.disconnected, (err: any) => {
        setLoading(false)
        console.log('sdk event: disconnected')
        if (err) {
          // 因为异常 而导致的断开！ 此处可以进行 提示通知等
          console.error('ws link disconnected because of Error')
          console.error(e.code, e.message, e.name, e.stack)
        }
      })
      .on(SDKEvents.asr, (asrData: any) => {
        // 监听到语音的识别结果（asr）
        console.log('sdk event: asr', asrData)
      })
      .on(SDKEvents.nlp, (nlpData: any) => {
        // 监听到大模型语义理解结果（nlp）
        console.log('sdk event: nlp', nlpData)
      })
      .on(SDKEvents.frame_start, (frameData: any) => {
        //监听到开始说话的推流首帧
        console.log('sdk event: frameBegin', frameData)
      })
      .on(SDKEvents.tts_duration, (sessionData: any) => {
        //监听到语音合成用时时长。
        console.log('sdk event: duration', sessionData)
      })
      .on(SDKEvents.frame_stop, (frameData: any) => {
        //监听到结束说话的末尾帧
        console.log('sdk event: frameEnd', frameData)
      })
      .on(SDKEvents.error, (error: any) => {
        //监听到错误信息
        console.log('sdk event: error', error)
      })
      .on(SDKEvents.action_start, (actionData: any) => {
        //监听到开始动作的推流首帧
        console.log('sdk event: actionBegin', actionData)
      })
      .on(SDKEvents.action_stop, (actionData: any) => {
        //监听到结束动作的末尾帧
        console.log('sdk event: actionEnd', actionData)
      })
// 可以选择性 按需 进行相关事件监听
    const player = avatarPlatform.player || avatarPlatform.createPlayer()
    player
      ?.on(PlayerEvents.play, () => {
        console.log('sdk event: player play')
      })
      .on(PlayerEvents.waiting, () => {
        console.log('sdk event: player waiting')
      })
      .on(PlayerEvents.playing, () => {
        console.log('sdk event: player playing')
      })
      .on(PlayerEvents.playNotAllowed, () => {
        // TODO 由于浏览器限制，如果用户从未对页面进行过交互点击等操作，则无法正常自动播放音视频等
        // 这里需要交互层面引导用户点击屏幕，然后逻辑调用resume 恢复方法
        console.log('sdk event: play not allowed, muted play')
      })
```

### 2.2.4 设置SDK配置（setApiInfo)
```javascript
avatarPlatform
  .setApiInfo({
    appId: '',//（必传）到交互平台-接口服务中获取，appid需要发布后使用
    apiKey: '',//（必传）到交互平台-接口服务中获取
    apiSecret: '',//（必传）到交互平台-接口服务中获取
    sceneId: '',//（必传）到交互平台-接口服务中获取，传入“接口服务ID”
    serverUrl: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact'//(必传)接口地址
  })
```

### 2.2.5 设置全局变量(setGlobalParams)
```javascript
  // 设置全局/连接 参数
  avatarPlatform
    .setGlobalParams({
    stream: {
      protocol: 'xrtc',（必传）实时视频协议，支持webrtc/xrtc，其中只有xrtc支持透明背景，需参数alpha传1
      alpha:1,//是否开启透明背景，0关闭1开始，需配合protocol=xrtc使用
    },
    avatar: {
      avatar_id: 'xxxxxxx', //（必传）授权的形象资源id，到交互平台-接口服务-形象列表中获取已授权的形象
    }, 
    tts: {
      vcn: 'xxxxxxxx', //（必传）授权的声音资源id，到交互平台-接口服务-声音列表中获取已授权的声音
    }
  })
```

### 2.2.6 发起连接--显示虚拟人
```javascript
// 获取token, 也可以提前获取，在上一步设置
avatarPlatform
      .start({
        //启动虚拟人，将视频流自动填充至class为wrapper的div中，该div必须具备大小
        wrapper: document.querySelector('.wrapper') as HTMLDivElement
      })
      .then(() => {
        console.log('connected &&  stream play successfully')
        // 注意这里仅是流可以播放， 如果是进页面在用户未交互网页时，代码自动连，
        // 第三步骤 player实例 可能收到PlayerEvents.playNotAllowed事件。
        // 您需要交互层面再次用户点击网页 并主动调用 player.resume() 恢复播放！！
        // 原因：受限于浏览器的自动播放策略
      })
      .catch((e: any) => {
        // 连接或者流失败，会话停止。
        console.error(e.code, e.message, e.name, e.stack)
      })
```

   **注意：：：**

**     ****<font style="color:#000000;">受限于浏览器对声音有自动播放限制策略</font>****<font style="color:#DF2A3F;"> ， 对于打开页面默认连接并展示虚拟人的情况时。 </font>**

**<font style="color:#DF2A3F;"> 	player实例 可能收到PlayerEvents.playNotAllowed事件。</font>**

**<font style="color:#DF2A3F;">  您需要设计界面 </font>**_**<u><font style="color:#000000;">引导用户与浏览器界面发生交互（如监听到用户点击网页） 后</font></u>**_**<font style="color:#DF2A3F;"> 调用 player.resume() 即可恢复声音播放！！</font>**

<font style="color:#DF2A3F;"> </font>

**至此 交互连接建立结束, 正常情况下, 页面的绘制区域应该已经已经正常显示虚拟人.**



### 2.2.6 过程中交互 
#### [文本模式]
```javascript
// 发送文本, 第二个参数 DriverExtend  为可选, 默认是文本合成驱动. 
// 可以通过配置nlp true 进行对文本理解, 具体参数参考对象说明DriverExtend
avatarPlatform.writeText("你是谁?", {
	nlp: true//nlp语义理解，false为关闭，true为开启。等于true时需要开启交互平台-接口服务-大模型对话中的大模型。
}).catch(e=> {
	// Error 
})
```



####  [全双工模式]   （全双工效果就是实时交互）
<font style="color:#DF2A3F;">(注意 startRecord 开启期间 请勿手动调用writeAudio, writeText 等手动交互控制)</font>

```javascript
const avatarPlatform =
      interactive?.recorder ||
      interactive?.createRecorder()
/**
 * 开始录音
 * 注意，需要用户进行过页面交互 直接调用，则会由于浏览器安全限制而失败！！
 * 对于进入页面 就想开启聆听模式的情况，交互层面 至少引导用户点击页面一次后（或者点击时间内） 进行调用startRecord
 *
 * @param {number} time 录音时长，单位ms   0代表全双工模式，一直处于聆听状态，实时交互
 * @param {function} callback 录音结束回调
 */
avatarPlatform?.startRecord(0, () => {
  console.log('recorder auto stopped')
})

// ===================================
// 停止录音（停止全双工）
avatarPlatform.stopRecord()
// 在startRecord 至 stopRecord 期间处于自由聆听的音频数据 并随时给出对应理解响应

```

####  [短语音模式]   
<font style="color:#DF2A3F;">(注意 startRecord 开启期间 请勿手动调用writeAudio, writeText 等手动交互控制)</font>



```javascript
const recorder =
      avatarPlatform?.recorder ||
      avatarPlatform?.createRecorder()
  /**
   * 开始录音
   * 注意，需要用户进行过页面交互 直接调用，则会由于浏览器安全限制而失败！！
   * 或者 再用户至少点击页面一次（或者引导点击） 进行调用
   * @param {number} time 录音时长，单位ms
   * @param {function} callback 录音结束回调
   */
  recorder?.startRecord(10 * 1000, () => {
    console.log('recorder auto stopped')
  })
// UserMediaError | ContextError
// 提示录音 权限、设备 / 环境安全等提示

//================================================
// 用户再次点击/ 鼠标松开 或特定交互事件 可以 调用停止录音
avatarPlatform.stopRecord()

// 虚拟人会理解 startRecord 至 stopRecord 期间聆听的音频数据 并给出对应理解响应

```

#### <font style="color:#000000;">[手动输入音频数据] --</font><font style="color:#DF2A3F;">一般情况，非特殊流程场景 请勿手动调用</font>
当然除了 封装的 录音交互流程外, 如果有需要, 您也可以手动进行传送**实时录音音频pcm 16k16bit**数据 进行交互驱动, 具体

```javascript

// 手动输入 pcm 16k16bit 音频驱动
avatarPlatform.writeAudio(arraybuffer, frameStatus).catch(e=> {
	// NetworkError 参考error code附录 
})

代码示例：
const audioInput = document.getElementById('audiofile');
audioInput.addEventListener('change', function (event) {
    const file = event.target.files?.[0];
    console.log("file:",file);
            const reader = new FileReader();
            reader.onload = function (e) {
              const arrayBuffer = e.target.result
              console.log(arrayBuffer.length)
              const chunkSize = 3200; // 每块的大小为1024 * 50字节
              let readed = 0
              while(readed < arrayBuffer.byteLength) {
                avatarPlatform2.writeAudio(arrayBuffer.slice(readed, readed+chunkSize),!readed ? 0: (readed+chunkSize) >= arrayBuffer.byteLength?2:1,{
                    nlp:false,
                    avatar_dispatch:{
                      audio_mode:0
                    }
                  })
                readed+= chunkSize
              }
            }
            reader.readAsArrayBuffer(file)
    }
});
```



### 2.2.7 断开当前连接（断连时必须调用stop，确保资源释放，不会占用路数）
```javascript
avatarPlatform.stop()
```

### 2.2.8 销毁实例（包含断开连接）
(销毁后当前句柄实例，不再继续调用实例进行操作)

```javascript
avatarPlatform.destroy()
```

# 3. SDK详情说明
##   
3.1 API说明
### 3.1.1	API 概括
| 方法 | 返回 | <font style="color:rgb(52, 73, 94);">Throws</font> | 说明 |
| --- | --- | --- | --- |
| getVersion | string | | SDK 静态方法 返回当前sdk的版本号 |
| setLogLevel | void | | SDK 静态方法 设置SDK 的日志输出级别 |
| createPlayer | IPlayer | | 使用内敛播放器时，创建播放器(默认不需要手动创建) |
| player | IPlayer | | 获取交互实例的播放器实例 |
| on | this | | 注册监听事件，start前执行 |
| off | this | | 注销监听事件 |
| setApiInfo | this | | 设置SDK配置信息，start前执行 |
| setGlobalParams | this | | 设置全局配置，start 前执行 |
| start | Promise<void> | CustomError | 建立连接 并完成初始化, 拉流播放操作 |
| writeText | Promise<string> | CustomError | **文本驱动**<br/>返回：resolve状态下返回request_id |
| createRecorder | IRecorder |  | 创建录音器 （已经存在录音器时，则直接返回存在的录音实例） |
| recorder | IRecorder | | 获取交互实例的录音器实例 |
| writeAudio | Promise<string> | CustomError | 手动发送音频数据   audio: 默认： 16k 16bit 单通道音频pcm数据   **<font style="color:#DF2A3F;">注意:  如当前正在使用内置API进行全双工模式/短语音交互(正在录音)时 谨慎手动调用手动写入音频数据   </font>**resolve状态下返回request_id |
| writeCmd | Promise<string> | CustomError | 触发立即指令 如：动作 |
| interrupt | Promise<void> | CustomError | 打断操作 |
| removeAllListeners | this | | 解绑所有事件监听 |
| stop | void |  | 断开已有连接,停止拉流渲染，释放播放器、录音设备等资源 |
| destroy | void | | 销毁实例，清除各类设置、监听、已初始化的内容, 释放相关资源 |


### 3.1.2 API文档
#### getVersion 静态方法
获取

Examples

```javascript
import AvatarPlatform from './sdk/3.0.0.1002/avatar-sdk-web_3.0.0.1002/index.js'
const version = AvatarPlatform.getVersion()

// 返回当前sdk 的版本号 形如： 3.0.0.1002
```

#### setLogLevel 静态方法
setLogLevel(level: LogLevel)

设置SDK的console 日志输出级别

Examples

```javascript
import AvatarPlatform from './sdk/3.0.0.1002/avatar-sdk-web_3.0.0.1002/index.js'
AvatarPlatform.setLogLevel(1)

// 打印debug 及以上信息
// 枚举级别如下
enum LogLevel {
  verbose = 0, // 全部打印
  debug = 1, // 主要调试信息
  info = 2,  
  warn = 3,  // 默认级别， 会输出warn / error
  error = 4,
  none = 5,
}
```

================================

以下是实例方法，调用前必须先实例sdk

以下演示代码 采用 avatarPlatform 作为 AvatarPlatform的实例

================================

#### 实例方法 /属性
#### player （播放器）
IPlayer 实例属性/API

| **<font style="color:rgb(52, 73, 94);">属性/API</font>** | **<font style="color:rgb(52, 73, 94);">参数类型</font>** | 必须 | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| <font style="color:rgb(52, 73, 94);">on</font> | <font style="color:rgb(52, 73, 94);">(eventName, listener)</font> | 否 | <font style="color:rgb(52, 73, 94);">事件绑定</font> |
| <font style="color:rgb(52, 73, 94);">off</font> | <font style="color:rgb(52, 73, 94);">(eventName, listener)</font> | 否 | <font style="color:rgb(52, 73, 94);">移除绑定</font> |
| muted | boolean | 否 | 设置视频静音/解除静音播放 |
| volume | number | 否 | 设置视频播放音量 [0~1] 默认1 |
| resume | API | 否 | <font style="color:#DF2A3F;">当player 收到 “not-allowed” 事件时，需要引导用户点击屏幕后调用 该API 恢复带声音播放</font> （浏览器禁止自动声音播放） |
| resize | API | 否 | 当窗口或者渲染区域第三方调整完毕，可以调用该API 保持清晰的渲染 |


Examples

```javascript
import AvatarPlatform, {
  PlayerEvents,
  SDKEvents,
} from './sdk/3.0.0.1002/avatar-sdk-web_3.0.0.1002/index.js'
// avatarPlarform 是 创建的交互实例 
// 获取交互的 播放器实例
const player = avatarPlatform.player ?? avatarPlatform.createPlayer()

// 按需绑定播放器的事件
player
      .on(PlayerEvents.error /* "error" */, (err: any) => {
        console.log('sdk player event: player error', err) 
      })
      ?.on(PlayerEvents.play, () => {
        console.log('sdk player event: player play')
      })
      .on(PlayerEvents.waiting, () => {
        console.log('sdk player event: player waiting')
      })
      .on(PlayerEvents.playing, () => {
        console.log('sdk player event: player playing')
      })
      .on(PlayerEvents.playNotAllowed, () => {
        console.log(
          'sdk player event: play not allowed, muted play， player call resume after user gusture'
        )
        // 受限于浏览器限制自动播放策略，出现时此时需要引导用户 和 当前页面交互 包括不限于点击， 
        // 事件内/后， 调用 player.resume() 进行恢复声音播放
      })


// 事件常量枚举如下， 可以按需选择监听事件
enum PlayerEvents {
  play = 'play',
  waiting = 'waiting',
  playing = 'playing', 
  playNotAllowed = 'not-allowed',
  error = 'error',
}
```

#### setApiInfo（设置SDK配置）
setApiInfo(apiInfo: ApiInfo)->this

设置实例交互连接信息

Required: true 

必须在发起连接（start api  ）前进行调用该API进行配置！

Examples

```javascript
avatarPlatform.setApiInfo({
  appId: '',//到交互平台-接口服务中获取
  apiKey: '',//到交互平台-接口服务中获取
  apiSecret: '',//到交互平台-接口服务中获取
  sceneId: '', //到交互平台-接口服务中获取，传入接口服务ID
  serverUrl: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact'//接口地址
})
```

Parameters

| **<font style="color:rgb(52, 73, 94);">Name</font>** | **<font style="color:rgb(52, 73, 94);">Type</font>** | Parent | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| appId | string | root | 申请的交互应用信息AppId |
| apiKey | string | root | 申请分发的交互应用信息apiKey |
| apiSecret | string | root | 申请分发的交互应用信息apiSecret |
| sceneId | string | root | 如果使用交互平台创建的项目配置，需要传交互平台中的接口服务ID |


#### setGlobalParams（设置全局变量）
setGlobalParams(config: IGlobalConfig)->this

设置实例交互连接时所需的连接参数/ 全局设置参数。

是否必须: 是

必须在发起连接（start api  ）前进行调用该API进行配置！

请求样例：

```javascript
// 接入时建议非必传参数的不要传，先传必传参数protocol、avatar_id、vcn调通，后续有需求再依次增加参数
avatarPlatform.setGlobalParams({
  stream: {//（必传）视频流信息
    protocol: 'xrtc',//（必传）实时视频协议，支持webrtc/xrtc/rtmp，其中只有xrtc支持透明背景，需参数alpha传1
    alpha:1,//（非必传）是否开启透明背景，0关闭1开始，需配合protocol=xrtc使用
    bitrate:1000000,//（非必传）视频码率，值越大，越清晰，对网络要求越高，默认1000000即可
    fps:25//（非必传）视频刷新率,值越大，越流畅，取值范围0-25，默认25即可
  },
  avatar: {//（必传）形象信息
    avatar_id: 'xxxxxxx', //（必传）授权的形象资源id，请到交互平台-接口服务-形象列表中获取
    width:1080,//（非必传）视频分辨率宽（不是画布的宽，调整画布大小需调整名为wrapper的div宽）
    height:1920,//（非必传）视频分辨率高（不是画布的高，调整画布大小需调整名为wrapper的div高）
    mask_region:'[0,0,1080,1920]',//（非必传）形象裁剪参数，[从左到右，从上到下，从右到左，从下到上]
    scale:1,//（非必传）形象缩放比例，取值范围0.1-1
    move_h:0,//（非必传）形象左右移动
    move_v:0,//（非必传）形象上下移动
    audio_format:1,//（非必传）音频采样率，传1即可
  }, 
  tts: {//（必传）发音人信息
    vcn: 'xxxxxxxx', //（必传）授权的声音资源id，请到交互平台-接口服务-声音列表中获取
    speed:50,//（非必传）语速
    pitch:50,//（非必传）语调
    volume:100//（非必传）音量
  },
  avatar_dispatch:{//交互模式
    interactive_mode:1,//（非必传）0追加模式，1打断模式
    content_analysis: 0,// （非必传）默认0， 是否开启情感分析，当前仅超拟人支持
  },
  subtitle:{//字幕信息
    subtitle:1,//（非必传）开启字幕，2D形象支持字幕，透明背景不支持字幕，3D形象不支持字幕（3D形象多为卡通形象，2D多为真人形象）
    font_color:'#FF0000',//（非必传）字体颜色
    font_name:"Sanji.Suxian.Simple",//（非必传）不支持自定义字体，若不想使用默认提供的
//字体，那么可以设置asr和nlp监听事件，去获取语音识别和语义理解的文本，自己前端贴字体。
//服务支持以下字体：'Sanji.Suxian.Simple','Honglei.Runninghand.Sim','Hunyuan.Gothic.Bold',
//'Huayuan.Gothic.Regular','mainTitle'
    position_x:100,//（非必传）设置字幕水平位置，必须配置width、height一起使用，否则字幕不显示
    position_y:0,//（非必传）设置字幕竖向位置，必须配置width、height一起使用，否则字幕不显示
    font_size:10,//（非必传）设置字幕字体大小，取值范围：1-10
    width:100,//（非必传）设置字幕宽
    height:100,//（非必传）设置字幕高
  },
  background:{//背景信息
    type:'res_key',//（非必传）上传图片的类型，支持url以及res_key。（res_key请到交互平台-素材管理-背景中上传获取)
    data:'xxxx',//（非必传）图片的值，当type='url'时,data='http://xxx/xxx.png'，当type='res_key'时，data='res_key值'（res_key请到交互平台-素材管理-背景中上传获取)
  },
  air:{//动作模式
    air:1,//（非必传）是否开启自动动作，0关闭，1开启，当开启时，虚拟人会根据语境自动匹配动作
    add_nonsemantic:1//（非必传）是否开启无指向性动作，0关闭，1开启，虚拟人会做没有意图指向性的动作
  }
})
```

#### start（启动虚拟人）
start(params:IStartParams)->Promise<void>

根据设置API后的参数 进行启动交互，并渲染虚拟人区域，return promise, 

<font style="color:#74B602;">整个过程流程包含： 当发起连接--> connected ---> init ---> 获取流地址 --->（拉流--> 播放成功)--->resolve</font>

Examples

```javascript
// 必须进行必要设置
avatarPlatform
  .start({
    wrapper: document.body    //渲染区域，注意 该区域必须存在大小
  })
  .then((()=> {
    console.log('虚拟人启动成功')
    })) 

// 发起连接
avatarPlatform.start({
    wrapper: document.querySelector('.wrapper')
  })
  .catch((e) => {
        // 可能 连接｜初始化｜拉流播放 阶段失败
        console.error(e.code, e.message, e.name, e.stack)
  })
```

Parameters

| **<font style="color:rgb(52, 73, 94);">Name</font>** | **<font style="color:rgb(52, 73, 94);">Type</font>** | Parent | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| params | IStartParams | root | 连接成功后需要播放画面填充的区域<br/>（注意： <font style="color:#DF2A3F;">该区域必须设置原始大小</font>，画面会以contain 模式填充画面， 不会自动撑开） |
| wrapper | HTMLDivElement | params |  |




#### writeText（发送文本驱动）
writeText(text: string, extend: TextDriverExtend)->Promise<string>

进行文本驱动与交互接口

[如何开启语义理解.pdf](https://www.yuque.com/attachments/yuque/0/2025/pdf/45536337/1748410726657-0201afd6-8863-4142-97f9-07d7109324da.pdf)

Required: false 

必须在发起连接成功后 执行 （start promise resolve 后）

Examples

```javascript
// 对 文本“你是谁”进行理解---》播报你是谁 对应的响应答案
avatarPlatform
  .writeText("你是谁", {
    nlp: true //nlp语义理解，false为关闭，true为开启。
    //这里当nlp等于true时为开启语义理解，需要开启交互平台-接口服务-大模型对话中的大模型。
  })


avatarPlatform
  .writeText("hello", {
    nlp: false // 当nlp=false时，为纯文本驱动，这里仅播报“hello” 原始字符串内容（不进行理解）虚拟人播报内容需少于2000字，包含标点符号
  })

avatarPlatform
  .writeText("你是谁", {
    nlp: true ,
    avatar_dispatch: { 
      interactive_mode: 1
    } // 1 是打断模式（停止之前的播报，立即开始下一段播报）， 0 为追加模式（累计消息，依次播报）
  })


// 全量参数， 属性为非必填
type TextDriverExtend = {
  nlp?: boolean  // 本次子会话是否走理解, 默认为false 纯文本播报
  tts?: {
    vcn?: string   // 本次子会话的发音人， 不指定 默认使用全局参数 发音人
    speed?: number // 本次子会话的语速， 不指定 默认使用全局参数 语速
    pitch?: number // 本次子会话的语调， 不指定 默认使用全局参数 语调人
    volume?: number // 本次子会话的音量， 不指定 默认使用全局参数 音量
  }
  avatar_dispatch?: {
    interactive_mode?: 1 | 0   // 文本驱动播报模式生效 // 子会话的打断模式，1 代表打断上一个会话的播报， 0 代表不打断，采用追加到之前的内容后 待播
    content_analysis?: 0 | 1  //  超拟人情感分析
  }
} 
```

Parameters

| **<font style="color:rgb(52, 73, 94);">Name</font>** | **<font style="color:rgb(52, 73, 94);">Type</font>** | Parent | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| text | string | root | 发送的文本信息，虚拟人播报内容包含标点符号需少于2000字 |
| extend | TextDriverExtend | root | 文本驱动的扩展信息 |


```javascript
type TextDriverExtend = {
  nlp?: boolean  // 本次子会话是否走理解, 默认为false 纯文本播报
  tts?: {
    vcn?: string   // 本次子会话的发音人， 不指定 默认使用全局参数 发音人
    speed?: number // 本次子会话的语速， 不指定 默认使用全局参数 语速
    pitch?: number // 本次子会话的语调， 不指定 默认使用全局参数 语调人
    volume?: number // 本次子会话的音量， 不指定 默认使用全局参数 音量
  }
  avatar_dispatch?: {
    interactive_mode?: 1 | 0   // 文本驱动播报模式生效 // 子会话的打断模式，1 代表打断上一个会话的播报， 0 代表不打断，采用追加到之前的内容后 待播
    content_analysis?: 0 | 1  // 超拟人情感分析
  }
}
```

Response:  Promise<asid>  
   该段文本的会话ID

#### createRecorder（创建内置录音器）
createRecorder()->IRecorder

创建recorder 录音器。  SDK 默认不会主动创建， 需要时 需要手动调用 createRecorder

Required: false 

 注： 需要在excute resolve 之后创建

Examples

```javascript
const recorder = avatarPlatform.recorder || avatarPlatform.createRecorder()

// 获取录音器的录音状态
recorder.recording ===> true | false

// 启动录音， 两种模式 一种全双工录音， 一种是短语音
// 注意： 浏览器限制 startRecord 必须在用户与document交互后调用。 否则会rejected.
recorder.startRecord(milliseconds: number, stopEvent?: Function).then(()=> {
  console.log('录音起启动成功')
})
// 1. 启动短语音 。类似于微信的录音
recorder.startRecord(60*1000, ()=>{
  // 停止的回调事件， recorder 主动stop / 被动停止 时 触发
  // 最长60秒 会自动停止
}).then(()=> {
  console.log('录音起启动成功')
})
// 2. 启动长语音 （全双工， 一直处于聆听模式）
recorder.startRecord(0, ()=>{
  // 停止的回调事件， recorder 主动stop / 被动停止 时 触发
}).then(()=> {
  console.log('录音起启动成功')
})


// 手动停止上面的录音
recorder.stopRecord() 

注：超拟人如需开启情感，请全局setGlobalParams 中开启 avatar_dispatch.content_analysis 参数
```



Parameters

无

#### recorder （开启语音交互，需先创建录音器）
IRecorder 实例属性/API

| **<font style="color:rgb(52, 73, 94);">属性/API</font>** | **<font style="color:rgb(52, 73, 94);">参数类型</font>** | 返回类型 | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| recording |  | boolean | 只读/ 录音器的录音状态 |
| startRecord | (duration: number, stopEvent?:Function) | Promise<void> | 启动录音    1. duration: 0 开启长聆听状态，不会主动停止，全双工交互   2. duration > 0, 最长录音duration毫秒 后主动停止<br/><br/>超拟人开启情感时，请全局setGlobalParams 中开启content_analysis 参数 |
| stopRecord | 无 | void | 主动停止录音 |
| <font style="color:rgb(52, 73, 94);">on</font> | <font style="color:rgb(52, 73, 94);">(eventName, listener)</font> | 否 | <font style="color:rgb(52, 73, 94);">事件绑定</font> |
| <font style="color:rgb(52, 73, 94);">off</font> | <font style="color:rgb(52, 73, 94);">(eventName, listener)</font> | 否 | <font style="color:rgb(52, 73, 94);">移除绑定</font> |




#### writeAudio（发送音频驱动）
writeAudio(arraybuffer:ArrayBuffer ,frameStatus: AudioFrameStatus,extend?: AudioDriverExtend)->Promise<string>

进行语音驱动接口 

<font style="color:#DF2A3F;">注意常规情况 必须要手动调用该接口。 如需调用，请联系技术支持人员</font>



Required: false 

必须在发起连接成功后 执行 （start promise resolve 后）

Examples

```javascript
//发送流式线性16k16bit pcm格式音频数据
//发送第一帧音频数据时status=0，中间status都等于1，结尾帧status=2。
//也就是说循环发送音频数据，status分别传入：0-1-1-1-……-1-1-1-2
avatarPlatform
  .writeAudio(buffer, 0, {
    nlp: true //nlp语义理解，false为关闭，true为开启。
    //这里当nlp等于true时为开启语义理解，需要开启交互平台-接口服务-大模型对话中的大模型。
  })
avatarPlatform
  .writeAudio(buffer1, 1, {
    nlp: true //nlp语义理解，false为关闭，true为开启。
    //这里当nlp等于true时为开启语义理解，需要开启交互平台-接口服务-大模型对话中的大模型。
  })
avatarPlatform
  .writeAudio(buffer3, 2, {
    nlp: true //nlp语义理解，false为关闭，true为开启。
    //这里当nlp等于true时为开启语义理解，需要开启交互平台-接口服务-大模型对话中的大模型。
  })

//nlp=false，直接播报传入的音频内容
//nlp=true，对传入音频进行语音识别并直接发送给大模型进行语义理解，最后播报理解内容

// 常量值枚举如下：
 enum AudioFrameStatus {
  start = 0,  //第一帧音频数据
  intermediate = 1,  //中间帧音频数据
  end = 2, //最后一帧音频数据
}
enum InputAudioMode {
  offline = 0, //离线音频数据
  realtime = 1, //实时录音数据
}
type AudioDriverExtend = {
  nlp?: boolean
  avatar_dispatch?: {
   audio_mode?: InputAudioMode 
   content_analysis?: 0 | 1  //  超拟人情感分析， 仅支持交互 
  }  
}
```

Parameters

| **<font style="color:rgb(52, 73, 94);">Name</font>** | **<font style="color:rgb(52, 73, 94);">Type</font>** | Parent | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| arraybuffer | ArrayBuffer | root | 发送的音频数据 （必须是16k16bit pcm） |
| frameStatus | AudioFrameStatus | root | 音频数据的状态 （0 代表起始帧率， 1代表中间帧数据， 2代表最后一帧数据） |
| extend | AudioDriverExtend | root | 音频数据发送时的扩展参数 |


```javascript
enum AudioFrameStatus {
  start = 0,  //第一帧音频数据
  intermediate = 1,  //中间帧音频数据
  end = 2, //最后一帧音频数据
}
enum InputAudioMode {
  offline = 0, //离线音频数据
  realtime = 1, //实时录音数据
}
type AudioDriverExtend = {
  nlp?: boolean
  avatar_dispatch?: {
   audio_mode?: InputAudioMode 
   content_analysis?: 0 | 1  //  超拟人情感分析， 仅支持交互 
  }   
  audio?: {
    encoding?: 'raw' // 当前仅支持16k16bit pcm 单通道线性音频数据
    channels?: 1
    bit_depth?: 16
  }
}
```

#### interrupt（打断=会同时打断播报和语义理解返回）
interrupt()->Promise<void>

立即进行虚拟人播报的打断操作（丢弃当前未播报完的数据），会同时打断语音播报和语义理解返回结果

Required: false 

必须在发起连接成功后 执行 （start promise resolve 后）

Examples

```javascript
// 主动打断虚拟人播报
avatarPlatform
  .interrupt()
```

Parameters 

无

#### writeCmd（驱动动作，动作标签请去：交互平台-接口服务-形象列表中点击查看动作获取）
writeCmd(type: CmdType, value:string)->Promise<string>

立即出发特定指令/   目前type仅支持 “action” 动作。

Required: false 

必须在发起连接成功后 执行 （start promise resolve 后）

Examples

```javascript
// 驱动虚拟人进行动作 A_Hello_l_F， 注意动作列表 由运营/技术支持进行提供。
avatarPlatform
  .writeCmd("action", "A_Hello_l_F")

```

Parameters

| **<font style="color:rgb(52, 73, 94);">Name</font>** | **<font style="color:rgb(52, 73, 94);">Type</font>** | Parent | **<font style="color:rgb(52, 73, 94);">Description</font>** |
| --- | --- | --- | --- |
| actionId | string | root | 驱动的动作标识 |


注意事项：  
当使用3D形象时（3D就是卡通形象），若虚拟人正在播报文本时发送该协议会打断当前播报的内容，暂无法修改

当使用2D形象时（2D就是真人形象），不存在该问题。

#### stop（主动断开连接，释放路数）
stop()->void

断开当前路会话，释放虚拟人服务开销 （并销毁播放/录音等前端占用资源）

Required: false 

<font style="color:#74B602;">注意： close 只是断开链接 释放资源。 后续可以对当前实例 （或者修改设置一些参数） 重新执行start 进行连接 & 拉流</font>

Examples

```javascript
// 如start 连接后，当需要断开虚拟人时可以调用
avatarPlatform
  .stop()
```

Parameters

无

#### destroy（销毁SDK实例）
destroy()->void

销毁当前实例 （内部也会包含调用了 close API 逻辑 ）

Required: false 

<font style="color:#74B602;">注意：</font><font style="color:#DF2A3F;"> 销毁当前实例  后续不能再次使用该实例 API ， 如需重新连接， 需要 重新new 一个 AvatarPlatform 实例对象</font>

Examples

```javascript
// 如vue/react 组件卸载时 可以调用销毁操作。
avatarPlatform
  .destroy()
```

Parameters

无



## 3.2 Events 事件
<font style="color:#74B602;">创建/获取实例后 均可以使用实例的on off API 进行注册/解除 相关类型事件监听</font>

### AvatarPlatform 交互实例
| 事件 | 参数 | 说明 |
| --- | --- | --- |
| connected | initResponse:InitResponse | 连接建立成功&服务链路初始化完毕 |
| error | (code:ErrorCode, message:String, data?:any) | 错误事件 code, message, <br/>data 为原始错误信息，如交互中nlp, asr 错误等原始消息数据 |
| frame_start | data:WsResponse | 单次交互服务端推流起始帧事件 |
| tts_duration | data:WsResponse | 单次交互服务端推流预计总时长 |
| frame_stop | data:WsResponse | 单次交互服务端推流结束帧事件 |
| action_start | data:WsResponse | 单次动作服务端推流起始帧事件 |
| action_stop | data:WsResponse | 单次动作服务端推流起始帧事件 |
| nlp | data:WsResponse | 语义理解结果事件 |
| asr | data:WsResponse | 识别结果事件 |
| disconnected | error | undefined | 连接被动断开事件, 当回调参数error 存在时， 说明断开是因为错误断开。错误原因：error 对象信息。 |


```javascript
interface InitResponse {
  stream_url: string,//视频流地址
  sid: string, //会话sdi
  session: data?.header?.session || '', // 会话
  appid: string, // 房间Appid, xrtc 模式返回
  user_sign: string,  // 拉流签名， xrtc 模式返回
}
```

### IPlayer实例
| 事件 | 参数 | 说明 |
| --- | --- | --- |
| play | 无 | 开始播放事件 |
| waiting | 无 | 数据缓冲等待事件 |
| playing | 无 | 数据缓冲后继续播放事件 |
| not-allowed | 无 | 由于浏览器限制 禁止声音自动播放 通知事件 |




### IRecorder实例
| 事件 | 参数 | 说明 |
| --- | --- | --- |
| mute | 无 | 静音macphone 通知事件 |
| unmute | 无 | 解除静音macphone 时触发 通知事件 |
| error | error:CustomError | 录音过程中异常关闭事件   特殊场景会触发，如：<br/>+ 录音中 移除了设备 且自动切换失败 无法继续<br/>+ 录音中关闭了浏览器的录音权限 无法继续 |




#   
附录 
## 常见错误及解决方式
<details class="lake-collapse"><summary id="ue3b8da4b"><span class="ne-text" style="font-size: 14px">websocket web Api云端错误码</span></summary><p id="u99ac38e9" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">1、错误码code=11200 msg='avatar authentication failed'或者 'vcn authentication failed' </span></strong></p><p id="u9f22732c" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">原因一：</span></strong><span class="ne-text" style="font-size: 14px">若是'avatar authentication failed'，可能是使用的形象id没有授权。</span></p><p id="u3e709945" class="ne-p"><span class="ne-text" style="font-size: 14px">     </span><strong><span class="ne-text" style="font-size: 14px"> 解决：</span></strong><span class="ne-text" style="font-size: 14px">请到交互平台-接口服务-形象列表中查看是否“已授权”，若未授权可以点击“获取授权”</span></p><p id="u46b6def9" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">原因二：</span></strong><span class="ne-text" style="font-size: 14px">若是'vcn authentication failed'，则是使用的发音人vcn没有授权</span></p><p id="u427308dd" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">请到交互平台-接口服务-声音列表中查看是否“已授权”，若未授权可以点击“获取授权”</span></p><p id="u9e95291d" class="ne-p"><span class="ne-text" style="font-size: 14px"> </span><strong><span class="ne-text" style="font-size: 14px">     原因三：</span></strong><span class="ne-text" style="font-size: 14px">使用的appid没有交互时长。</span></p><p id="u8776a93f" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">请到交互平台-接口服务-授权能力“在线虚拟人驱动”右侧的授权详情中查看”剩余交互时长“默认600分钟，若不显示了意味着600分钟消耗完了，请求则会报错11200，请联系对接的运营人员处理。（交互时长是按照websocket连接时长算的，非调试阶段，记得断连哦）</span></p><p id="uebd3367c" class="ne-p"><span class="ne-text" style="font-size: 14px"> </span><img src="https://cdn.nlark.com/yuque/0/2025/png/45536337/1752462142503-f19b2264-b448-447e-b9ca-a44bb144d2ab.png?x-oss-process=image%2Fcrop%2Cx_0%2Cy_0%2Cw_1908%2Ch_621" width="1590" title="" crop="0,0,1,0.6141" id="u7dfd7c06" class="ne-image"></p><p id="u2a025b00" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">2、错误码code=11203 msg='avatar authentication failed'</span></strong></p><p id="uf3848d91" class="ne-p"><span class="ne-text" style="font-size: 14px">     </span><strong><span class="ne-text" style="font-size: 14px"> 原因：</span></strong><span class="ne-text" style="font-size: 14px">授权路数不足（路数：同一时间开启虚拟人服务支持的并发数量）</span></p><p id="u46ddcb0e" class="ne-p"><span class="ne-text" style="font-size: 14px">    </span><strong><span class="ne-text" style="font-size: 14px">  解决：</span></strong><span class="ne-text" style="font-size: 14px">1、进入交互平台-我的订阅中查看使用的appid是否还在有效期内，若过期，则路数为0，启动报错11203，请联系对接的运营人员处理。</span></p><p id="u8fede3fa" class="ne-p"><span class="ne-text" style="font-size: 14px">                2、进入交互平台-接口服务-授权能力中“在线虚拟人驱动”右侧显示的路数，若为1路，则只能同时开启一路虚拟人，第二路则报错11203，扩充路数请联系对接的运营人员进行采购。</span></p><p id="uff24c6af" class="ne-p"><span class="ne-text" style="font-size: 14px">                3、若遇到当前并没有启动虚拟人且appid也没有过期，依旧报错11203，那么请去交互平台-交互日志中选择“持续中”的链路点击“终止会话”强行断连虚拟人，另外项目中断连虚拟人一定要调用stop协议，释放资源，防止未断连的情况。</span></p><p id="u090e2bbf" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">3、错误码code=600000、600003或20015、29004 msg='必要参数缺失 InvalidParam InvalidParam: 必要参数缺失'或'连接异常 ConnectError ConnectError: 连接异常'</span></strong></p><p id="u3d6c242c" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">原因：</span></strong><span class="ne-text" style="font-size: 14px">必要参数缺失</span></p><p id="u5121a55e" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">首先检查SetApiInfo中的五个参数是否缺失和正确，不许有空格</span></p><p id="u01cbebdc" class="ne-p"><span class="ne-text" style="font-size: 14px">                示例：appid/apiKey/apiSecret/sceneId均再交互平台-接口服务中获取。sceneId对应的是”接口服务Id“</span></p><pre data-language="plain" id="pXPbf" class="ne-codeblock language-plain"><code>appId: 'c8224dxxx',
apiKey: 'ee158cb8c4783636496edadfabbaxxxxxxxx',
apiSecret: 'ZWY3N2E2N2M3OTMwMDhjN2xxxxxxxxxx',
serverUrl: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact',
sceneId: '772137xxxxxxxxxxxxxx',</code></pre><p id="u255b9d78" class="ne-p"><span class="ne-text" style="font-size: 14px">               其次检查SetGlobalParams中视频协议protocol、形象avatar_id、发音人vcn是否缺失和正确，不许有空格</span></p><p id="u7f44476a" class="ne-p"><span class="ne-text" style="font-size: 14px">               示例：</span></p><pre data-language="plain" id="HKNFw" class="ne-codeblock language-plain"><code>{
  stream: {
    protocol: 'xrtc',
  },
  avatar: {
    avatar_id: '110117005',（到交互平台-接口服务-形象列表中获取已授权的形象）
  },
  tts: {
    vcn: 'x4_lingxiaoying_assist',（到交互平台-接口服务-声音列表中获取已授权的声音）
  },
}</code></pre><p id="u99ccb562" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">4、错误码code=10110 msg='service license not enough'</span></strong></p><p id="u9bfe615e" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">原因：</span></strong><span class="ne-text" style="font-size: 14px">服务器路数占用达到上线</span></p><p id="u9208d318" class="ne-p"><span class="ne-text" style="font-size: 14px">      </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">联系技术人员解决</span></p><p id="u3e0e427d" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">5、错误码code=10114 msg='over time'</span></strong></p><p id="u3f9392e2" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       原因：</span></strong><span class="ne-text" style="font-size: 14px">连接超时</span></p><p id="u77198443" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       解决：</span></strong><span class="ne-text" style="font-size: 14px">1、网络状态不好，导致SDK心跳超时</span></p><p id="ufe1aa11b" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">6、错误码code=10107，msg=tdp config error:tdp.botId can not be blank</span></strong></p><p id="ua72d703c" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       原因1：</span></strong><span class="ne-text" style="font-size: 14px">SetApiInfo中没有传sceneId参数</span></p><p id="u5233ae12" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">SetApiInfo中传参sceneId，sceneId对应的是交互平台-接口服务-”接口服务ID“</span></p><p id="u7dbdf3d9" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">原因2：</span></strong><span class="ne-text" style="font-size: 14px">交互平台-接口服务-大模型对话中没有打开大模型</span></p><p id="u75cd7d51" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1741239817360-9bbeeaa2-8f22-49ef-8967-dfcf4842ec00.docx" id="tnR8h" class="ne-card-file" style="font-size: 14px">📎如何开启语义理解.docx</a></p><p id="ufb844a60" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">原因3：</span></strong><span class="ne-text" style="font-size: 14px">交互平台-接口服务-大模型对话中没有选中知识库版本</span></p><p id="u5b85ed19" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1742365740955-ab542573-25d1-499f-9157-ab6d039f54a0.docx" id="vHmmn" class="ne-card-file" style="font-size: 14px">📎知识库操作手册.docx</a></p><p id="u60431eb8" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">7、错误码code=20009 msg='width must be a multiple of 4' 'ConnectError' 'ConnectError: width must be a multiple of 4\n</span></strong></p><p id="u7bf5817c" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       原因：</span></strong><span class="ne-text" style="font-size: 14px">SetGlobalParams中宽高不是4的倍数</span></p><p id="u680b23d8" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       解决：</span></strong><span class="ne-text" style="font-size: 14px">SetGlobalParams中的width、height必须是4的倍数</span></p><p id="ue768c0e9" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">8、错误码code=10107 msg='asr config error'</span></strong></p><p id="u51e5af7b" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">原因1</span></strong><span class="ne-text" style="font-size: 14px">：SetApiInfo中没有传sceneId参数</span></p><p id="u80d9f2b1" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">SetApiInfo中传参sceneId，sceneId对应的是交互平台-接口服务-”接口服务ID“</span></p><p id="uc1586d51" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">原因2</span></strong><span class="ne-text" style="font-size: 14px">：appid的语音识别配置错误</span></p><p id="u399bf924" class="ne-p"><span class="ne-text" style="font-size: 14px">       </span><strong><span class="ne-text" style="font-size: 14px">解决</span></strong><span class="ne-text" style="font-size: 14px">：到交互平台-接口服务-大模型对话-交互配置中，点击保存，重新发布appid，重启虚拟人</span></p><p id="u8b3030aa" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">9、错误码code=10163 msg=&quot;'$.parameter.avatar.move_h' value must be less or equal than 4096; &quot; 'ConnectError' &quot;ConnectError: '$.parameter.avatar.move_h' value must be less or equal than 4096; </span></strong></p><p id="ud9e8a613" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       原因：</span></strong><span class="ne-text" style="font-size: 14px">SetGlobalParams中参数move_h、move_v参数值非法</span></p><p id="ud4cf709e" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">       解决：</span></strong><span class="ne-text" style="font-size: 14px">SetGlobalParams中参数move_h、move_v参数值取值范围是[-4096,+4096]</span></p><p id="u8aa1b6ba" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">10、错误码code=20016 msg='vcn is invalid' 'ConnectError' 'ConnectError: vcn is invalid</span></strong></p><p id="ud6317045" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">        原因：</span></strong><span class="ne-text" style="font-size: 14px">SetGlobalParams中参数vcn参数值非法（vcn概念：发音人，请到交互平台-接口服务-发音人列表中获取）</span></p><p id="u33b9e8e0" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">        解决：</span></strong><span class="ne-text" style="font-size: 14px">检查SetGlobalParams中参数vcn的参数值是否正确，不允许有空格（vcn概念：发音人，请到交互平台-接口服务-发音人列表中获取）</span></p><p id="u95e3caa9" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">11、收到警告：'PlayerEvents.playNotAllowed事件'，start成功后但是虚拟人未展示或者虚拟人展示了，驱动后没有声音但口唇在动</span></strong></p><p id="u67f2aeb2" class="ne-p"><span class="ne-text" style="font-size: 14px">        </span><strong><span class="ne-text" style="font-size: 14px"> 原因：</span></strong><span class="ne-text" style="font-size: 14px">由于游览器限制自动播放的策略，导致虚拟人播放失败。</span></p><p id="u2918acc9" class="ne-p"><span class="ne-text" style="font-size: 14px">         </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">必须！要与游览器产生交互，例如点击页面或者dom组件。然后去调用player.resume()方法解除静音。具体可以看下本文档内容的第2.2.5条红字部分</span></p><p id="ua1646100" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">12、msg='Uncaught i: navigator.mediaDevices is undefined'</span></strong></p><p id="u4cf7f96c" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         原因：</span></strong><span class="ne-text" style="font-size: 14px">非安全域名下，浏览器不具备能力，是无法使用媒体设备导致的。</span></p><p id="u590837fd" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         解决：如果是固定设备：</span></strong></p><p id="u3d08d153" class="ne-p"><span class="ne-text" style="font-size: 14px">                       启用不限制不安全源的功能<br /></span><span class="ne-text" style="font-size: 14px">                       在 chrome://flags 页面的搜索框中输入以下关键词来查找并启用相应的实验性标志：<br /></span><span class="ne-text" style="font-size: 14px">                       允许在不安全源中使用受限制的功能<br /></span><span class="ne-text" style="font-size: 14px">                       搜索 “Insecure origins treated as secure” 选项。</span></p><p id="u58b8a28b" class="ne-p"><span class="ne-text" style="font-size: 14px">                       设置步骤：将该选项的状态从 “Default” 改为 “Enabled”。<br /></span><span class="ne-text" style="font-size: 14px">                       在下方会出现一个输入框，在其中输入你部署的 HTTP 协议网页的 URL（例                                                     如 </span><a href="http://example.com），多个" data-href="http://example.com），多个" target="_blank" class="ne-link"><span class="ne-text" style="font-size: 14px">http://example.com</span></a><span class="ne-text" style="font-size: 14px">），多个 URL 之间用逗号分隔。<br /></span><span class="ne-text" style="font-size: 14px">                       点击页面底部的 “Relaunch” 按钮重启 Chrome 浏览器，使设置生效。</span></p><p id="u8ed8c555" class="ne-p"><span class="ne-text" style="font-size: 14px">                       启用该选项后指定的 HTTP 网页将被 Chrome 视为安全源，从而可以使用原本受限制的功能。</span></p><p id="ub66f9da5" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">                   如果是对外c端用户，</span></strong><span class="ne-text" style="font-size: 14px"> 那就要https了。</span></p><p id="uec613a15" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">13、语音交互无法使用</span></strong></p><p id="ud780651c" class="ne-p"><span class="ne-text" style="font-size: 14px">        </span><strong><span class="ne-text" style="font-size: 14px"> 原因：</span></strong><span class="ne-text" style="font-size: 14px">1、后台配置错误。2、语音识别配置错误。3、设置了唤醒词（限定词）</span></p><p id="u46f835ba" class="ne-p"><span class="ne-text" style="font-size: 14px">         </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">1、参考第6条依次排查。2、参考第8条排查。3、到交互平台-接口服务-交互配置中查看是否设置了唤醒词，若设置了唤醒词，那么每次交互都需要先说唤醒词才行，想要快速测试语音交互，可以先将唤醒词删掉，点击保存，重新发布appid，再重启虚拟人。</span></p><p id="u629abf2b" class="ne-p"><span class="ne-text" style="font-size: 14px">         </span><strong><span class="ne-text" style="font-size: 14px">提高唤醒词识别概率的方法：</span></strong><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1742780434197-d5fb47d7-fc7b-45bf-a1d7-a479f8daa395.docx" id="R2dQM" class="ne-card-file" style="font-size: 14px">📎唤醒词操作手册-接口服务.docx</a></p><p id="u8a0f0b95" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">14、错误码code=20017, message: 'illegal text '或者code=10110, message: 'word contain sensitive'</span></strong></p><p id="ua116df94" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         原因：</span></strong><span class="ne-text" style="font-size: 14px">文本中包含敏感词汇</span></p><p id="ud1d2176c" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         解决：</span></strong><span class="ne-text" style="font-size: 14px">试用阶段无法解决，购买后可以联系对接的运营人员免除审核</span></p><p id="u449cacfe" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">15、启动后虚拟人形象只有头部或者出现重影</span></strong></p><p id="u13ead503" class="ne-p"><span class="ne-text">        </span><img src="https://cdn.nlark.com/yuque/0/2025/png/45536337/1744341072278-0c9f4b70-84a3-4cff-aa65-c4444c4796d2.png?x-oss-process=image%2Fcrop%2Cx_504%2Cy_0%2Cw_1216%2Ch_1011" width="299" title="" crop="0.2644,0,0.9019,1" id="ubb611be9" class="ne-image"><img src="https://cdn.nlark.com/yuque/0/2025/jpeg/45536337/1744340998989-32ec5336-6b40-466e-a254-59e1cdaac6d6.jpeg" width="233.9817657470703" title="" crop="0,0,1,1" id="dmXka" class="ne-image"><span class="ne-text">                                                         </span><img src="https://cdn.nlark.com/yuque/0/2025/png/45536337/1748567507895-4aa7ebce-dd8d-427b-8f64-35dc36b4f5aa.png" width="326.65362548828125" title="" crop="0,0,1,1" id="u837ef60d" class="ne-image"></p><p id="u7e4e9833" class="ne-p"><span class="ne-text" style="font-size: 14px">         </span><strong><span class="ne-text" style="font-size: 14px">原因：</span></strong><span class="ne-text" style="font-size: 14px">使用的形象是超拟人形象。免费试用的有：</span><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">cnrfb86h2000000004、</span><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); background-color: rgb(250, 250, 250); font-size: 14px">cnr5dg8n2000000003、</span><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">cnrmkf0e2000000006、cnrn9jgi2000000005。</span></p><p id="u4b1c7f52" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">解决：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">更换除此以外的形象id即可。另外超拟人形象不支持透明背景（会导致重影）、背景图、移动，裁剪。</span></p><p id="u34da4d9c" class="ne-p"><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">16、错误码code:10106 msg=&quot;payloadpayload.text.content invalid'</span></strong></p><p id="u46d66b16" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">原因：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">文本传的空值</span></p><p id="uce32a3b1" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">解决：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">writeText中的text不要传空值。</span></p><p id="ub599d2dd" class="ne-p"><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">17、错误码code:10223 msg=&quot;RemoteLB: can't find valued addr&quot;</span></strong></p><p id="ud4ebeaa1" class="ne-p"><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         原因：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">使用的形象服务器中未部署</span></p><p id="u6585bae0" class="ne-p"><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         解决：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">联系这边运营或者技术人员解决</span></p><p id="uace0656a" class="ne-p"><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">18、错误码code:10106 msg=&quot;payloadtext.content lenght less than 2000&quot;</span></strong></p><p id="ue45d5763" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">原因：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">播报文本长度大于2000</span></p><p id="uc7b5ddba" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">解决：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">播报文本长度不得超过2000字，包含标点符号</span></p><p id="u813937ed" class="ne-p"><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">19、错误码code:10316 msg=&quot;sub:mvc is invalid&quot;</span></strong></p><p id="u6f30aac6" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">原因：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">申请的是“云+端”的appid能力，而web-sdk、web-api、android-sdk需要的是“在线虚拟人驱动能力”。</span></p><p id="u55b64f47" class="ne-p"><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">         </span><strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">解决：</span></strong><span class="ne-text" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">需重新申请“在线虚拟人驱动”能力的appid，详细操作看文档：    </span><a href="https://www.yuque.com/attachments/yuque/0/2025/pdf/45536337/1744269709351-49556b9d-7d7d-4447-93fc-0e7e4f3db0ab.pdf" id="ue0270776" class="ne-card-file" style="color: rgba(0, 0, 0, 0.88); font-size: 14px">📎交互平台申请接口服务Appid.pdf</a></p><p id="u952d2710" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">20、错误码code：10222 msg=“rpc error: code = Unknown desc = http download fail with 404 Not Found”</span></strong></p><p id="u1a28c707" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         原因：</span></strong><span class="ne-text" style="font-size: 14px">背景图下载失败</span></p><p id="u8b17e03a" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         解决：</span></strong><span class="ne-text" style="font-size: 14px">更换一个背景图</span></p><p id="u49858eab" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">21、错误码code：13001 msg=“asr failed”</span></strong></p><p id="u7edc6f57" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">          原因：</span></strong><span class="ne-text" style="font-size: 14px">申请的appid没有开启“大模型对话”能力，那么也就没有语音识别的能力。</span></p><p id="u827b2ee4" class="ne-p"><img src="https://cdn.nlark.com/yuque/0/2025/png/45536337/1755596480853-4cbb9019-5550-467e-b4b2-66ebee245049.png?x-oss-process=image%2Fcrop%2Cx_0%2Cy_0%2Cw_1908%2Ch_683" width="588" title="" crop="0,0,1,0.6756" id="u8756fcfd" class="ne-image"><strong><span class="ne-text" style="font-size: 14px"><br /></span></strong><strong><span class="ne-text" style="font-size: 14px">          解决：</span></strong><span class="ne-text" style="font-size: 14px">重新申请一个appid，开启“大模型对话”能力</span></p><p id="u5aeaa3b6" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">22、报错：TypeError: Cannot read private member from an obiect whose class did not declare it</span></strong></p><p id="u90817976" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">          原因：</span></strong><span class="ne-text" style="font-size: 14px">实例化对象挂载问题。</span></p><p id="ue33b6533" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">          解决：</span></strong><span class="ne-text" style="font-size: 14px">最简单的  先挂到全局 或者 定义的变量 ，不要挂在vue的状态 或者 能被vue proxy 代理的对象上</span></p><p id="ue0a9be36" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">23、错误码code：10108 msg=“session is invalid”</span></strong><span class="ne-text" style="font-size: 14px"><br /></span><span class="ne-text" style="font-size: 14px">          </span><strong><span class="ne-text" style="font-size: 14px">原因：</span></strong><span class="ne-text" style="font-size: 14px">wss://avatar.cn-huadong-1.xf-yun.com/v1/interact还没连接上，就发送了start或者其他交互/驱动协议。导致报错。</span></p><p id="u535087ee" class="ne-p"><span class="ne-text" style="font-size: 14px">          </span><strong><span class="ne-text" style="font-size: 14px">解决：</span></strong><span class="ne-text" style="font-size: 14px">等待ws已建立连接后，在发送start和交互/驱动协议。</span></p></details>
## 常见需求场景及实现方案
<details class="lake-collapse"><summary id="u6e5c467c"><span class="ne-text" style="font-size: 14px">常见需求场景及实现方案</span></summary><p id="u0da09120" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">1、如何接入第三方大模型</span></strong></p><p id="u8bebe201" class="ne-p"><span class="ne-text" style="font-size: 14px">     方案：</span><a href="https://www.yuque.com/attachments/yuque/0/2026/pdf/45536337/1776922414455-2057af2c-3ab9-477f-97d8-f45b47c64927.pdf" id="u6d2772b0" class="ne-card-file" style="font-size: 14px">📎如何调用第三方大模型.pdf</a></p><p id="u1141b561" class="ne-p"><span class="ne-text" style="font-size: 14px">     若要封装成OpenAI协议参考：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/pdf/45536337/1741673942201-f9462b7f-49e1-47ca-a67c-702e48dd4d02.pdf" id="LkazH" class="ne-card-file" style="font-size: 14px">📎OpenAI协议.pdf</a></p><p id="uae30116c" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">2、如何使用知识库实现控制数字人回复的内容</span></strong></p><p id="u7199b224" class="ne-p"><span class="ne-text" style="font-size: 14px">     操作：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1742365711412-dfe115d0-35b9-44c3-9ed7-a263573a72c4.docx" id="oove9" class="ne-card-file" style="font-size: 14px">📎知识库操作手册.docx</a></p><p id="u4391ed09" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">3、如何开启语义理解</span></strong></p><p id="u28e34905" class="ne-p"><span class="ne-text" style="font-size: 14px">     操作：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1741244495540-704b93ba-a994-498d-ac40-1fb3408ccad9.docx" id="BhD97" class="ne-card-file" style="font-size: 14px">📎如何开启语义理解.docx</a></p><p id="ubca353a6" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">4、如何设置唤醒词</span></strong></p><p id="u0a510d7d" class="ne-p"><span class="ne-text" style="font-size: 14px">     操作：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1742780458434-930945da-6568-4c99-8016-24a296915827.docx" id="f0FVS" class="ne-card-file" style="font-size: 14px">📎唤醒词操作手册-接口服务.docx</a></p><p id="u765be169" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">5、如何实现透明背景</span></strong></p><p id="u682c909e" class="ne-p"><span class="ne-text" style="font-size: 14px">     操作：使用xrtc协议同时参数alpha传1</span></p><pre data-language="javascript" id="KUeup" class="ne-codeblock language-javascript"><code>{{
  avatar_dispatch: { interactive_mode: 0 },
  stream: {
    protocol: 'xrtc',
    alpha:1,
  },
  avatar: {
    avatar_id: '110117005',（到交互平台-接口服务-形象列表中获取已授权的形象）
  },
  tts: {
    vcn: 'x4_lingxiaoying_assist',（到交互平台-接口服务-声音列表中获取已授权的声音）
  },
}}</code></pre><p id="ua83af169" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">6、如何更换背景图片</span></strong></p><p id="u99bbd0c6" class="ne-p"><span class="ne-text" style="font-size: 14px">     操作：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1741252017804-046799c4-1694-4a3d-ae92-b4d20174cb6e.docx" id="uJh8h" class="ne-card-file" style="font-size: 14px">📎如何更换背景图片.docx</a></p><p id="u6ebcce1f" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">7、是否支持移动设备和安卓系统</span></strong></p><p id="u09a24d4e" class="ne-p"><span class="ne-text" style="font-size: 14px">     现象：某些安卓设备上使用游览器，可能无法展示出虚拟人。</span></p><p id="u5800b13b" class="ne-p"><span class="ne-text" style="font-size: 14px">     解答：websdk在安卓端或者移动设备上的游览器不保证都支持，由于没有覆盖所有的设备，不同设备的游览器内核都不一样，因此不保证都支持，websdk通常用在pc端以及大屏上。</span></p><p id="u2343d4e3" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">8、是否支持接入到小程序中</span></strong></p><p id="ubdcaf036" class="ne-p"><span class="ne-text" style="font-size: 14px">      解答：1、小程序 建议使用web-api，protocol 用rtmp, 拿到地址 用 小程序 live-player 进行拉流播放</span></p><p id="u3cbb89e2" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">9、如何让虚拟人执行动作</span></strong></p><p id="u81378547" class="ne-p"><span class="ne-text" style="font-size: 14px">      解答：</span><span class="ne-text" style="font-size: 14px">驱动动作有三种方式</span></p><p id="ucbf108f8" class="ne-p"><span class="ne-text" style="font-size: 14px">动作标签请到交互平台-接口服务-形象列表点击“查看”获取。</span></p><p id="ud70373c5" class="ne-p"><span class="ne-text" style="font-size: 14px">1、发送动作驱动协议，websdk的协议中有写writeCmd，传入动作标签。</span></p><p id="u2ddcf5b8" class="ne-p"><span class="ne-text" style="font-size: 14px">2、在文本中插入动作指令[[action=动作标签]]，。例如发送文本：&quot;⼤家好，[[action=A_RH_hello_O]]我是数字⼈，今天天气晴朗&quot;。</span></p><p id="ue20ee666" class="ne-p"><span class="ne-text" style="font-size: 14px">3、setGlobalParams协议中有个air自动动作，传1可以根据文本自动匹配动作。</span></p><p id="ube6d4392" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">10、如何判断虚拟人已经播报完毕</span></strong></p><p id="u04e17edb" class="ne-p"><span class="ne-text" style="font-size: 14px">        解答：监听事件中有个frameBegin和frameEnd事件，代表推流开始和结束可以看作是虚拟人开始说话和结束说话的标识，由于大模型是流式返回，所以会有多个frameBegin和frameEnd，当触发frameEnd事件获取参数vmr_status=2且后面1秒内没有新的frameBegin时就代表当前播报结束</span></p><p id="ubb1f7fb2" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">11、如何判断虚拟人当前动作执行完毕</span></strong></p><p id="u173e9360" class="ne-p"><span class="ne-text" style="font-size: 14px">        解答：监听事件中有个actionBegin和actionEnd事件，代表推流开始和结束可以看作是虚拟人开始做动作和结束动作的标识，当触发actionEnd事件获取参数vmr_status=2且后面1秒内没有新的actionBegin时就代表当前动作结束</span></p><p id="u10ed570c" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">12、如何流式发送文本</span></strong></p><p id="uf46fe361" class="ne-p"><span class="ne-text" style="font-size: 14px">        解答：writeText()支持流式发送文本，需要开启追加模式。注意：每次调用writeText()不要只发送一两个文字且不要发送空文本，会有卡顿的感觉，需要利用标点符号作为分割符拼凑成一段话再调用writeText()。</span></p><p id="u70f9da13" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">13、如何让虚拟人视频铺满屏幕</span></strong></p><p id="u89057f8c" class="ne-p"><span class="ne-text" style="font-size: 14px">        解答：调整class为“wrapper”的div画布的大小，虚拟人视频会自动填充div的大小，放大会影响清晰度，一般SetGlobalPrams中的宽高传1080P的即可，即1920*1080。但是自动填充的范围也是有比例限制的。例如setGlobalPrams中的width和height是1920*1080，而屏幕大小是1920*1200，那么当宽已经达到最大值，高就无法铺满屏幕。</span></p><p id="uad621114" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">14、是否支持自动动作</span></strong></p><p id="u7bcee6b1" class="ne-p"><span class="ne-text" style="font-size: 14px">        解答：支持，需要使用有动作的形象，再SetGlobalParams中添加以下air参数，虚拟人会根据传入的文本自动匹配动作。</span></p><pre data-language="javascript" id="J49Si" class="ne-codeblock language-javascript"><code>{{
  stream: {
    protocol: 'xrtc',
    alpha:1,
  },
  avatar: {
    avatar_id: '110117005',（到交互平台-接口服务-形象列表中获取已授权的形象）
  },
  tts: {
    vcn: 'x4_lingxiaoying_assist',（到交互平台-接口服务-声音列表中获取已授权的声音）
  },
  air: {
    air: 1,
    add_nonsemantic: 1,
  },
}}</code></pre><p id="ud384cafb" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">15、如何指定文字或数字发音</span></strong></p><p id="u3b1e0930" class="ne-p"><span class="ne-text" style="font-size: 14px">         请参考：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1741674016823-46bc0618-f6c0-457c-b973-2aa6647714d2.docx" id="B5tyG" class="ne-card-file" style="font-size: 14px">📎标记文本.docx</a></p><p id="u3e1a09e7" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">16、如何实现半身形象</span></strong></p><p id="ucc0a9bfc" class="ne-p"><span class="ne-text" style="font-size: 14px">         解答：1、方式1：设置SetGlobalParams中的mask:&quot;[xx,xx,xx,xx]&quot;参数，mask是对形象做裁剪，依次是</span></p><p id="uf8b17188" class="ne-p"><span class="ne-text" style="font-size: 14px">[从左到右，从上到下，从右到左，从下到上]。另外超拟人形象不支持裁剪。</span></p><p id="u502dab23" class="ne-p"><span class="ne-text" style="font-size: 14px">                   2、方式2：直接联系对接的商务授权半身形象，但半身形象大都是一直在做无指向性动作的（即动作无法控制）。</span></p><p id="ua64ac459" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">17、特定对话如何和web端对接，让web获取特定参数去执行操作</span></strong></p><p id="u7619738f" class="ne-p"><strong><span class="ne-text" style="font-size: 14px">         </span></strong><span class="ne-text" style="font-size: 14px">解答：配置FAQ类型知识库，答案中预设指令双中括号：[[img=内容自定义]]，前端监听nlp返回的数据，凡是双中括号内的内容都不会播报，然后获取中括号内自定义的参数去执行操作</span></p><p id="u8454c194" class="ne-p"><span class="ne-text" style="font-size: 14px">         如何监听到nlp返回数据？见：</span></p><p id="u825a5469" class="ne-p"><span class="ne-text">        </span><img src="https://cdn.nlark.com/yuque/0/2025/png/45536337/1742364679886-de5e6b3c-e98b-4410-913a-b7d70a6721af.png" width="565.4444580078125" title="" crop="0,0,1,1" id="RMqin" class="ne-image"></p><p id="ud14ad7b8" class="ne-p"><span class="ne-text">         知识库如何操作？：</span><a href="https://www.yuque.com/attachments/yuque/0/2025/docx/45536337/1742365678347-5264378e-6fee-4019-9a33-02b6feb29cfc.docx" id="nX4t9" class="ne-card-file">📎知识库操作手册.docx</a></p><p id="u9cccae55" class="ne-p"><strong><span class="ne-text">18、如何让数字人反馈正在思考或者正在执行之类的话术，等回复到了之后再进行语音回复</span></strong></p><p id="ue37ffbd7" class="ne-p"><span class="ne-text">         解答：语音交互时，会最先返回监听到的asr（语音识别）信息。当监听到的时候就立马发送一个文本驱动播报（writeText协议且nlp传false），且模式选择追加模式，否则会打断后续语义理解内容。</span></p><p id="u08585e79" class="ne-p"><strong><span class="ne-text">19、接口中是否可以展示图片、视频、链接。</span></strong></p><p id="u4c9d0a16" class="ne-p"><span class="ne-text">         解答：由于兜底回复以及大模型都不知道你要回复什么链接。所以这个链接肯定是要在知识库中配置的。接口中的前端页面无法展示图片、视频、链接。但是可以再</span><strong><span class="ne-text">nlp监听事件</span></strong><span class="ne-text">中获取知识库中预设的图片、视频、链接的地址。</span><strong><span class="ne-text">那么前端的展示等操作需要开发者自行实现。</span></strong></p><p id="uc9fcbf68" class="ne-p"><strong><span class="ne-text">20、示例demo如何打包</span></strong></p><p id="u77265948" class="ne-p"><strong><span class="ne-text">          解答：</span></strong><span class="ne-text">首先不推荐打包该demo，该demo仅用来了解调用逻辑和功能。若需要打包，添加build命令：&quot;build&quot;:&quot;cross-env version=3.1.0 &amp;&amp; vite build&quot;</span></p><p id="u873472bc" class="ne-p" style="text-align: center"><img src="https://cdn.nlark.com/yuque/0/2025/jpeg/45536337/1744092297690-38810862-6b33-48a8-a60f-8d9473611a8f.jpeg" width="565.6458129882812" title="" crop="0,0,1,1" id="u8X8w" class="ne-image"></p><p id="u725c883b" class="ne-p"><strong><span class="ne-text">21、接入第三方大模型或者智能体时，文本驱动采用追加模式时，播报卡顿。</span></strong></p><p id="u13acceab" class="ne-p"><span class="ne-text">         </span><strong><span class="ne-text">解答：</span></strong><span class="ne-text">原因是因为大部分大模型是一个字一个字的流式返回，然后一个字一个字的调用文本驱动的话，就会有卡顿的感觉，并且有时还会单独返回一个空格或者回车，这样调文本驱动会报错误。</span></p><p id="ufb4b3925" class="ne-p"><span class="ne-text">         </span><strong><span class="ne-text">解决：</span></strong><span class="ne-text">不要一个字一个字的返回，要根据标点符号，拼凑成一段一段的文本再去调用文本驱动。</span></p><p id="u379c355a" class="ne-p"><span class="ne-text">例如：“你好，”、“我是虚拟人晓姿，”、“很高兴认识你。”</span></p><p id="u0b58d85f" class="ne-p"><strong><span class="ne-text">22、前后端联调实现加密，规避敏感信息明文展示。</span></strong></p><p id="u7842458f" class="ne-p"><strong><span class="ne-text">         解答：</span></strong><span class="ne-text">SetApiInfo中只传appid、sceneId和signedUrl，其余可不传。</span></p><p id="ue6dc3a41" class="ne-p"><span class="ne-text">signedUrl由后端鉴权后回传全地址，格式:wss://avatar.cn-huadong-1.xf-yun.com/v1/interact?authorization=xxxxxx&amp;host=avatar.cn-huadong-1.xf-yun.com&amp;date=xxxxxxx。</span></p><p id="ue8f429b8" class="ne-p"><span class="ne-text">后端鉴权方式请查看Web api文档中的demo或者握手地址文档。</span></p><p id="u26941a5e" class="ne-p"><img src="https://cdn.nlark.com/yuque/0/2025/jpeg/45536337/1760153415552-12fca644-5f22-4bf6-982b-6cfa0d5561c9.jpeg?x-oss-process=image%2Fcrop%2Cx_0%2Cy_112%2Cw_1920%2Ch_845" width="1600" title="" crop="0,0.0994,1,0.8483" id="u729e7ba2" class="ne-image"></p><p id="u1a69fe08" class="ne-p"><strong><span class="ne-text">23、暂停续播的实现方案。</span></strong></p><p id="ub6eca6f2" class="ne-p"><span class="ne-text">         </span><strong><span class="ne-text">解答：</span></strong><span class="ne-text">首先虚拟人API本身不支持暂停续播，并且也无法获取具体读到哪一个字了，因此需自己实现暂停续播，续播也只能从被暂停的句子的句首重播。</span></p><p id="u9c3ddc44" class="ne-p"><span class="ne-text">         </span><strong><span class="ne-text">解决：</span></strong><span class="ne-text">实现方案：</span></p><p id="u2a736495" class="ne-p"><span class="ne-text">1、流式的发送句子，设置追加模式（interactive_mode=0）让虚拟人播报（writeText）。</span></p><p id="ucd685a1e" class="ne-p"><span class="ne-text">2、每开始读一个句子的时候会触发frameBegin，读完了会触发frameEnd事件。从而可以判断哪些句子读完了，哪些句子没读，和正在读哪个句子。</span></p><p id="u74f6eeda" class="ne-p"><span class="ne-text">3、发送打断（interrupt）协议，实现暂停、此时也需要知道被打断的是哪个句子。</span></p><p id="u9b42ef3f" class="ne-p"><span class="ne-text">4、续播：重新发送被打断的句子以及后面未读的句子（writeText，interactive_mode=0）。</span></p><p id="u2de7507d" class="ne-p"><strong><span class="ne-text">24、如何实现自定义字幕</span></strong></p><p id="u20841bbc" class="ne-p"><strong><span class="ne-text">         解答：</span></strong></p><p id="u6c29a656" class="ne-p"><img src="https://cdn.nlark.com/yuque/0/2026/png/45536337/1776915214456-7b47ffd3-b024-4130-9457-69e3496870b3.png" width="323.66143798828125" title="" crop="0,0,1,1" id="u42914a0d" class="ne-image"><img src="https://cdn.nlark.com/yuque/0/2026/png/45536337/1776922218399-8730009d-c88e-4120-a25c-3a1efd31d650.png" width="325.65362548828125" title="" crop="0,0,1,1" id="uc050cca4" class="ne-image"><strong><span class="ne-text"><br /></span></strong><strong><span class="ne-text">         解决：</span></strong><span class="ne-text">需要先获取nlp的响应文本（图一，也就是数字人播报文本），然后能够判断虚拟人播报开始和结束时间点（图二），这样就可以自己前端去贴字幕，获取到nlp响应的流式文本后，放到自己的字幕队列里，然后根据frameBegin和frameEnd去一个一个贴到前端。</span></p></details>
## 错误码
###  本地端侧错误码（不包含websocket web Api 的云端错误码）
```typescript
// 交互相关错误常量
export const InteractiveErrors = {
  ParamMissing: {
    code: '600003',
    message: '必要参数缺失',
  },
  InvalidServerError: {
    code: '600002',
    message: '无效的ServerUrl',
  },
  NetworkError: {
    code: '600003',
    message: '连接异常',
  },
  InvalidResponse: {
    code: '600004',
    message: '无效的响应',
  },
  UnknownError: {
    code: '999999',
    message: '未知错误',
  },
}
// 播放器相关错误常量
export const PlayerError = {
  EmptyStreamError: {
    code: '700000',
    message: '无效的流数据',
  },
  PlayNotAllowed: {
    code: '700006',
    message: '播放不允许',
  },
  MissingPlayerLibsError: {
    code: '700001',
    message: '缺失播放插件',
  },
  H264NotSupported: {
    code: '700002',
    message: '当前设备不支持 H.264',
  },
  Unknown: {
    code: '700005',
    message: '播放失败',
  },
}
// 录音器相关错误常量
export const UserMediaError = {
  SecurityError: {
    code: '800000',
    message: '不支持的环境',
  },
  NotFoundError: {
    code: '800001',
    message: '未找到指定约束的设备',
  },
  NotAllowedError: {
    code: '800002',
    message: '设备访问权限异常/无法请求使用源设备',
  },
  NotReadableError: {
    code: '800003',
    message:
      '暂时无法访问摄像头/麦克风，请确保当前没有其他应用请求访问设备，并重试',
  },
  OverconstrainedError: {
    code: '800004',
    message: '无效的设备请求参数',
  },
  AbortError: { code: '800005', message: '未知原因操作已终止' },
  InvalidStateError: {
    code: '800006',
    message: '当前页面未处于激活状态',
  },
  NotAllowedWithoutGestureError: {
    code: '800007',
    message: '页面未发生用户交互，请求被终止',
  },
}

```

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);"> 				</font>

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);"> 					</font>

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);"> 							</font>

 

 

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);"> 					</font>

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);"> 				</font>

<font style="background-color:rgb(100.000000%, 100.000000%, 100.000000%);"> 			</font>

 		

 	   

