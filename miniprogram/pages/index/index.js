const app = getApp()
wx.cloud.init();
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png', // 未登录时的状态图片
    userInfo: {}, // 存储用户信息列表
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '', // 请求结果
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') // 如需尝试获取用户信息可改为false
  },

  onLoad: function () {
    //wx.hideTabBar()
  }, //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
 
  getUI(e) { //点击授权登录时产生的监听事件
    var t = this // 定义 变量 t var 可以定义全局变量 let 定义局部变量
    //console.log('获取头像昵称', e) // console.log 打印输出
    wx.getUserProfile({ //获取用户信息。页面产生点击事件（例如 button 上 bindtap 的回调中）后才可调用，每次请求都会弹出授权窗口，用户同意后返回 userInfo,用于替换 wx.getUserInfo
      lang: 'zh_CN', //显示用户信息的语言
      desc: '用于在后台更好的识别您的身份', //声明获取用户个人信息后的用途
      success(res) { //接口调用成功的回调函数
        //console.log('获取', res)
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            app.globalData.openid = res.result.openid
            db.collection('users').where({_openid:res.result.openid}).get({
              success:function(res) {
                if (res.data.length==0) {
                  console.log("新建一个用户")
                  db.collection('users').add({
                    data: {
                      openid: app.globalData.openid
                    }
                  }).then(res => {
                    console.log('添加成功', res)
                  })
                  .catch(err => {
                    console.log('添加失败', err)
                  })
                } else {
                  console.log("存在这个用户")
                }
                //console.log(res.data)
                wx.switchTab({ //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 就是首页  
                  //用户授权成功后就要跳转到首页导航栏
                  url: "/pages/items/items",
                }); // 进入到首页后，出现消息提示窗，提示用户:'欢迎使用本小程序'的提示语
              },
            });
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
        wx.setStorageSync('userInfo', res.userInfo); // userInfo 本地缓存指定的 key  res.userInfo 需要存储的数据
        // wx.setStorageSync('userInfo', res.userInfo); 第一个参数为本地缓存指定的 key 
        // 第二个参数为 res.userInfo 为要需要存储的数据信息 这里要把 res.userInfo 获取到的用户信息列表，存储在userInfo 列表里面
        t.setData({ //对 userInfo 进行数据更改，赋值
            userInfo: res.userInfo, //把获取到的数据列表赋值给 userInfo 改变里面的数据
            avatarUrl: res.userInfo.avatarUrl //把头像地址赋值给 avatarUrl
        }),
        wx.showToast({ //显示消息提示框
          image: "/static/image/success.png", //自定义图标的本地路径，image 的优先级高于 icon
          icon: "success", //显示成功图标，此时 title 文本最多显示 7 个汉字长度
          title: '欢迎使用本小程序',
          duration: 1000, //提示的延迟时间 为1s 1000ms=1s
        });
      },
      
      fail(err) { //接口调用失败的回调函数 用户拒绝授权登录后，出现的提示窗
        console.error(err) //打印输出错误数据
        wx.showToast({ // 拒绝登录 显示消息提示框 
          image: "/static/image/error.png",
          title: '用户拒绝授权', // 提示用户：'用户拒绝授权'
          icon: "error",
          duration: 1000 // 提示语出现时间延迟1s
        });
      }
    })
  },
  
  onShow() { //页面显示或从后台跳回小程序时显示此页面时触发，从跳转页面返回时触发，不能传递参数
    this.setData({
      userInfo: wx.getStorageSync('userInfo') // 更新存储里面的 key ：userInfo
    })
  },
  
  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({// 更新数据和给字段赋值
          avatarUrl: res.userInfo.avatarUrl,// 更新用户图像列表
          userInfo: res.userInfo,// 更新用户列表列表信息
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },
})
