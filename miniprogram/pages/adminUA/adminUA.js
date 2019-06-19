var util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取的二手物品数据
    user_data: [],
    //下拉继续读取数据
    nextPage: 0,
    //用户id openid
    openid: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    // 改变选项卡的值
    console.log(options.tab_id)
    that.setData({
      currentData: options.tab_id,
      openid: app.globalData.openid
    })
    //调用获取用户信息数据
    this.getData();
  },



  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
    that.nextLoad();
    console.log("lower")
  },

  // 在云数据库上查找数据(查找10条)
  nextLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    const db = wx.cloud.database()
    // 查询所有用户的闲置二手信息
    db.collection('users')
      .skip(this.data.nextPage)
      .limit(10) // 限制返回数量为 10 条
      .get({
        //成功读取写入数据
        success: res => {
          this.setData({
            // user_data: JSON.stringify(res.data, null, 2)
            // user_data:res.data
            user_data: this.data.user_data.concat(res.data),
            nextPage: this.data.nextPage + 10
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
    wx.showToast({
      title: '加载成功',
      icon: 'success',
      duration: 1000
    })
  },

  //第一次从数据查找数据
  getData: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('users')
      .limit(10) // 限制返回数量为 10 条
      .get({
        success: res => {
          this.setData({
            // user_data: JSON.stringify(res.data, null, 2)
            user_data: res.data,
            nextPage: this.data.nextPage + 10
            // user_data:this.data.user_data.concat(res.data)
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


  updateUser: function (e) {
    const idx = e.target.dataset.idx
    //获得用户id
    var user_id = this.data.user_data[idx]._id
    var users_Name = this.data.user_data[idx].name
    wx.showModal({
      title: '认证通过',
      content: users_Name,
      success(res) {
        // 修改用户认证信息
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('users').doc(user_id).remove({
            //删除成功显示提示
            success: function (res) {
              console.log("删除成功")
              console.log(res)

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      }
    })

  
  },




  //点击取消用户认证
  removeUser: function (e) {
    const idx = e.target.dataset.idx
    //获得帖子id
    var user_id = this.data.user_data[idx]._id
    var users_Name = this.data.user_data[idx].name
    wx.showModal({
      title: '认证不通过',
      content: users_Name,
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('users').doc(user_id).remove({
            //删除成功显示提示
            success: function (res) {
              console.log("删除成功")
              console.log(res)

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      }
    })
  },



})