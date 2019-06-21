// pages/news_main/news_main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 跳转到指定的列表地址
  jumpToList: function(e){
    // 判断跳转的选项卡
    var tab_id=0
    switch(e.currentTarget.id){
      case "secondHand":
          tab_id=0;
          break; 
      case "express":
          tab_id=1;
          break; 
      case "trifles":
        tab_id=2;
        break; 
    }
    wx.navigateTo({
      url:"../myGoods/myGoods?tab_id=" + tab_id
      // url:"../goods/goods"
    })
  },


})