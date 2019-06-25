// pages/myGoods/myGoods.js

var util = require('../../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡的编号
    currentData: 0,
    //获取的数据集
    feed: [],
    feed_length: 0,
    //下拉继续读取数据
    nextPage:0,

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
    })
    //调用应用实例的方法获取全局数据
    console.log(app.globalData.userCloudData._openid)
    this.dbLoad();
  },

  //完成选项卡的跳转
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })

  },

  //分析选项卡是否正确
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },


  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.dbLoad();}, 1000);
    that.dbLoad();
    console.log("lower")
  },

  // 在云数据库上查找数据(查找10条)
  dbLoad: function () {
    var that = this;
    util.dbLoad('post', that, app.globalData.userCloudData._openid);
  },

  //跳转到点击页面
  jumpToPost: function(e){
    var id=e.currentTarget.id
    console.log(e.currentTarget.id)
    console.log(this.data.feed[id])
    var post_data=JSON.stringify(this.data.feed[id])
    wx.navigateTo({
      // url: '../posttest/posttest?post_data=' + post_data
      url: '../contact/contact?post_data=' + post_data
    
    })
  },

  //点击删除帖子
  removeImage:function(e) {
    const idx = e.target.dataset.idx
    //获得帖子id
    var post_id=this.data.feed[idx]._id
    var goods_Name=this.data.feed[idx].title
    var removeImgs=this.data.feed[idx].imgs
    console.log(removeImgs)

    // 删除用户上传的图片
    wx.cloud.deleteFile({
      fileList: removeImgs,
      success: res => {
        // handle success
        // console.log("res.fileList")
        console.log("删除照片成功")
      },
      fail: err => {
        // handle error
      }
    })
    // 删除用户二手物品的数据库
    wx.showModal({
      title: '删除物品',
      content: goods_Name,
      success (res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('post').doc(post_id).remove({
            //删除成功显示提示
            success: function(res) {
              console.log("删除二手物品成功")
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