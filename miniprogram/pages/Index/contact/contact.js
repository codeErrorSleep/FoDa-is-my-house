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
    post_data:{}
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
        post_data:post_data,
        user_id:post_data._openid
    })


    console.log(this.data.post_data)
    console.log(this.data.user_id)
    


    this.getUserData()


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
    if(isRegistered=="Ture")
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
        content=this.data.user_data.phone_num
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
  }


})