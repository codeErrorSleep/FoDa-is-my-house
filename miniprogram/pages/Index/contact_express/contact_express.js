const app = getApp();
Page({

  data: {
    //快递信息
    express_data: {},
    //劫取快递重量
    express_weight: "",
    //用户openid
    user_openid: "",
    //接收者真实姓名
    accepter_real_name: "",
    //接收者微信
    accepter_wechat_id: "",
    //接收者电话号码
    accepter_phone: "",
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
    this.getAccepter()
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
  accept:function(){
    wx.cloud.callFunction({
      name: 'updateAccepter',
      data: {
        express_id: this.data.express_data._id,
        user_openid: this.data.user_openid,
        database:"express"
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

  //获取接收者信息
  async getAccepter(){
    console.log('fuck',this.data.express_data.accepter_openid)
    var that=this
    if (this.data.express_data.accepter_openid!=""){
      const db = wx.cloud.database()
      await db.collection('users').where({
        _openid: this.data.express_data.accepter_openid,
      }).get({
        success: async function(res) {
          console.log(res.data[0])
          await that.setData({
            accepter_real_name: res.data[0].real_name,
            accepter_wechat_id: res.data[0].wechat_id,
            accepter_phone: res.data[0].phone,
          })
        }
      })
    }else {
      that.setData({
        accepter_real_name: "",
        accepter_wechat_id: "",
        accepter_phone: "",
      })
    }
  }
})