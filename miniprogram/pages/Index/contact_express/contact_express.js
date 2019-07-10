const app = getApp();
Page({

  data: {
    //快递信息
    express_data: {},
    //劫取快递重量
    express_weight: "",
    //用户openid
    user_openid: "",
  },

  onLoad: function (options) {
    var express_data=JSON.parse(options.express_data)
    this.setData({
      express_data:express_data,
      user_openid: app.globalData.userCloudData._openid,
    })
    this.setData({
      express_weight: this.data.express_data.weight.split('(')[0]
    })
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

  //接收快递任务
  accept(){
    wx.cloud.callFunction({
      name: 'updateExpress',
      data: {
        express_id: this.data.express_data._id,
        user_openid: this.data.user_openid
      },
      success: res => {
        console.warn('[云函数] [updateExpress] updateExpress 调用成功：', res)
        wx.showModal({
          title: '更新成功',
          content: '成功更新信息',
          showCancel: false,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [updateExpress] updateExpress 调用失败：', err)
      }
    })
    wx.navigateBack({})
  },
})