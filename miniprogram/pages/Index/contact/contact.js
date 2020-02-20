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
    var post_data=JSON.parse(options.post_data)
    this.setData({
        swiperList: app.globalData.swiperList,
        post_data:post_data,
        user_id:post_data._openid,
        windowWidth: wx.getSystemInfoSync().windowWidth,
        ori_post_data: options.post_data,
    })

    // 允许此页面进行转发
    wx.showShareMenu({
      withShareTicket: true
    }); 

    console.log(this.data.post_data)
    console.log(this.data.user_id)

    this.getUserData()
  },




  // 页面分享函数
  onShareAppMessage: function (options) {
    var post_type = "闲置"
    if (this.data.post_data.type == "寻物") {
      post_type = "寻物"
    } else if (this.data.post_data.type == "找队友") {
      post_type = "找队友"
    }

    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    return {
      //## 此为转发页面所显示的标题
      title: post_type + ": " + this.data.post_data.title,
      path: 'pages/Index/contact/contact?post_data=' + this.data.ori_post_data,
      imageUrl: this.data.post_data.imgs[0],
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


  //用户联系方式复制
  showConnect: function (e) {
    // 判断当前用户是否为以注册用户
    var isRegistered=util.isRegistered()


    if(isRegistered)
    {
      // 判断微信定系手机
      var promptTitle=""
      var content=""
      if(e.currentTarget.id==="wechatButton"){
        promptTitle="卖家微信"
        content=this.data.user_data.wechat_id
      }
      else{
        promptTitle="卖家手机号码"
        content=this.data.user_data.phone
      }
      console.log(promptTitle)
      console.log(content)
      wx.showModal({
        title: promptTitle,
        content: content,
        confirmText:"复制",
        success: function (res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: content,
              success: function (res) {
                wx.showToast({
                  title: '复制成功',
                });
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }

  },

  // 复制功能函数
  copyText:function(connectWay){
    var that = this;
    wx.setClipboardData({
      data: that.data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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