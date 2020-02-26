// pages/contact/contact.js
var util = require('../../../utils/util.js')
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    user_id: "",
    user_data: {},
    //帖子信息
    post_data:{},
    //头像列表
    swiperList:[],
    // 当前使用者的id
    user_openid:"",
    // 接单者的信息
    accepter_wechat_id: "",
    accepter_phone: "",
    //窗口宽度
    windowWidth: 0,    
    // json格式的帖子信息
    ori_post_data: {},
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var post_data = JSON.parse(options.post_data)
    this.setData({
      swiperList: app.globalData.swiperList,
      post_data: post_data,
      user_id: post_data._openid,
      // user_openid: app.globalData.userCloudData._openid,
      windowWidth: wx.getSystemInfoSync().windowWidth,
      ori_post_data: options.post_data,
    })
    // 判断是否已有全局的用户信息
    if (typeof app.globalData.userCloudData._openid != "undefined") {
      this.setData({
        user_openid: app.globalData.userCloudData._openid,
      })
    }

    console.log(this.data.post_data)
    console.log(this.data.user_id)

    // 获取求助主人的信息
    this.getUserData()
    // 检查是否有人接单
    this.getAccepter()
  },

  // 页面分享函数
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    return {
      //## 此为转发页面所显示的标题
      title: "求助: " + this.data.post_data.title,
      path: 'pages/Index/contact_recourse/contact_recourse?post_data=' + this.data.ori_post_data,
      // imageUrl:this.data.post_data.imgs[0],
      success: function (res) {
        console.log("发送成功")
      },
      fail: function () {
        console.log("发送失败")
      }
    }
  },


  // 获取物品主人的信息
  getUserData:function(){
    const db = wx.cloud.database()
    // 查询当前物品的主人信息
    db.collection('users').where({
      _openid:this.data.user_id
    }).get({
      success: res => {
        this.setData({
          user_data:res.data[0]
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.user_data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
  },

  //接收快递任务
  accept: function () {
    console.log(this.data.post_data._id)
    console.log(this.data.user_openid)

    // 判断当前用户是否为以注册用户
    var isRegistered = util.isRegistered()
    if (isRegistered) {
      // 通过转发进来的需要设置他的openid
      if (!this.data.user_openid) {
        this.setData({
          user_openid: app.globalData.userCloudData._openid
        })
      }

      if (this.data.post_data._openid == this.data.user_openid) {
        wx.showToast({
          title: "本人不能接自己的帖子,还是让别人来帮忙吧",
          icon: 'none',
          duration: 1500,
          mask: true
        });
      } else {
  // 添加接单者到数据库   
        this.addAccepter();
      }
    }
  },

  // 添加接单者到数据库
  addAccepter:function(){
    wx.cloud.callFunction({
      name: 'updateAccepter',
      data: {
        _id: this.data.post_data._id,
        user_openid: this.data.user_openid,
        database: "recourse"
      },
      success: res => {
        console.warn('[云函数] [updateAccepter] updateAccepter 调用成功：', res)
        wx.showModal({
          title: '成功接单',
          content: '你已成功接单',
          showCancel: false,
        })
        // 成功后发送求助的模板信息
        this.sendRecourse("求助成功")
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [updateAccepter] updateAccepter 调用失败：', err)
      },
      complete:res => {
        // 直接跳转到我的求助
        wx.redirectTo({
          url: "../../News/myDiscover/myDiscover"
        })
      },
    })



  },





  // 发送求助模板消息
  sendRecourse: function (orders) {
    var orders = orders
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendRecourseTemplate',
        orders: orders,
        user_openid: this.data.post_data._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] sendRecourseTemplate 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] sendRecourseTemplate 调用失败：', err)
      }
    })
  },



  //获取接收者信息
  async getAccepter(){
    console.log('fuck',this.data.post_data.accepter_openid)
    var that=this
    if (this.data.post_data.accepter_openid!=""){
      const db = wx.cloud.database()
      await db.collection('users').where({
        _openid: this.data.post_data.accepter_openid,
      }).get({
        success: async function(res) {
          console.log(res.data[0])
          await that.setData({
            accepter_wechat_id: res.data[0].wechat_id,
            accepter_phone: res.data[0].phone,
          })
        }
      })
    }
  },

  //用户点击放大图片
  handleImagePreview:function(e) {
    var index = e.target.dataset.index
    var images = this.data.post_data.imgs
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

})