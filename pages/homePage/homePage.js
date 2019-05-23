var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    cardSwiper: [
      '../../images/test.jpg',
      '../../images/test.jpg',
      '../../images/test.jpg',
      '../../images/test.jpg',
    ],
    cardLinks:[
      "../test2/test2",
      "../test2/test2",
      "../test2/test2",
      "../test2/test2",
    ],
    //这里不写第一次启动展示的时候会有问题
    swiperCurrent: 0
  },

  // 改变现在的图片点
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  // 跳转到轮播图地址
  swipclick: function (e) {
    console.log(this.data.swiperCurrent);
    wx.navigateTo({
      url: this.data.cardLinks[this.data.swiperCurrent]
    })
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
      url:"../index/index?tab_id=" + tab_id
      // url:"../index/index"
    })
  },



  
})