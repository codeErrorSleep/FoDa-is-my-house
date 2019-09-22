var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取的二手物品数据
    feed: [],
    //下拉继续读取数据
    nextPage: 0,
    //用户id openid
    openid: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()

    console.log('onLoad')

    //调用获取用户信息数据
    this.allLoad();

    console.log(this.data.feed)
  },



  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.allLoad();}, 1000);
    that.allLoad();
    console.log("lower")
  },

  // 在云数据库上查找数据(查找10条)
  allLoad: function () {
    var that = this;
    // util.allLoad('users', that, '.');
    //查询所有用户
    const db = wx.cloud.database()
    db.collection('users')
      .where({
        "al_approve": false
      })
      .orderBy('date', 'desc')
      .skip(that.data.nextPage)
      .limit(10) // 限制返回数量为 10 条
      .get({
        //成功读取写入数据
        success: res => {
          that.setData({
            feed: this.data.feed.concat(res.data),
            nextPage: this.data.nextPage + 10
          })
          console.log('[数据库] [查询记录] 成功: ', that.data.feed)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      });
    console.log(this.data.feed)
  },

  // 通过用户信息验证
  updateUser: function (e) {
    console.log(this.data.feed)
    var that = this
    const idx = e.target.dataset.idx
    //获得用户记录id 不是oppenid
    var user_id = this.data.feed[idx]._id
    var user_openid = this.data.feed[idx]._openid
    var users_Name = this.data.feed[idx].nick_name
    var formId = this.data.feed[idx].formId

    // 更新数据库 用户消息
    wx.showModal({
      title: '认证通过',
      content: users_Name,
      success(res) {
        if (res.confirm) {
          // 调用云函数修改用户信息
          wx.cloud.callFunction({
            name: 'approvePass',
            data: {
              user_id: user_id,
              approve: true,
              al_approve: true
            }, success: function (res) {
              console.log("修改成功" + res)
            }, fail: function (res) {
              console.log(res)
            }
          })
          // 调用模板消息发送消息
          that.sendTemplate("认证成功", user_openid, formId)
        }
      }
    })






  },

  // 发送模板消息
  sendTemplate: function (approve, user_openid, formId) {
    console.log(user_openid)
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: formId,
        approve: approve,
        user_openid: user_openid
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        wx.showModal({
          title: '发送成功',
          content: '成功发送信息',
          showCancel: false,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },

  //不通过用户验证
  removeUser: function (e) {
    const idx = e.target.dataset.idx
    //获得帖子id
    var that = this
    var user_id = this.data.feed[idx]._id
    var users_Name = this.data.feed[idx].nick_name
    wx.showModal({
      title: '认证不通过',
      content: users_Name,
      success(res) {
        if (res.confirm) {
          // 通过用户验证
          const db = wx.cloud.database()
          wx.cloud.callFunction({
            name: 'approvePass',
            data: {
              user_id: user_id,
              approve: false,
              al_approve: true
            }, success: function (res) {
              console.log("修改成功" + res)
            }, fail: function (res) {
              console.log(res)
            }
          })
          // 调用模板消息发送消息
          that.sendTemplate("认证不成功", user_openid, formId)
        }
      }

    })



  },

  //用户点击放大图片
  handleImagePreview:function(e) {
    var index = e.target.dataset.index
    console.log(e)
    var images = this.data.feed[index].approve_img
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  }


})