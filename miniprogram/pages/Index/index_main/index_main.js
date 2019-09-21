var util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {

    // 轮播图
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }],

    //用户的信息
    openid:"",


    //这里不写第一次启动展示的时候会有问题
    swiperCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');

    //获取用户的openid并设置为全局变量
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid:res.result.openid
        })
        util.getUserInCloud(this.data.openid);
      }
    })

  },

  onShow: function (options) {
    //获取用户的openid并设置为全局变量
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid: res.result.openid
        })
        util.getUserInCloud(this.data.openid);
      }
    })
  },

  ////////////////////////////////  轮播图 控制
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  ////////////////////////////////  轮播图 控制


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
      url:"../goods/goods?tab_id=" + tab_id
      // url:"../../BackUp/test2/test2" 
      // url:"../../BackUp/test/test" 
    })
  },


  // 发布二手交易信息
  publishPost:function(){
    wx.navigateTo({
      url:"../../Post/uploadGoods/uploadGoods"
    })
  },

  //发布快递交易信息
  publishExpress:function(){
    wx.navigateTo({
      url: "../../Post/uploadExpress/uploadExpress"
    })
  },

  // 发布发现信息
  publishDiscover:function(){
    wx.navigateTo({
      url:"../../Post/uploadDiscover/uploadDiscover"
    })
  },

  // 弹出发布选择框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 隐藏发布选择框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },






})