var util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {

    // 轮播图
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://tva1.sinaimg.cn/large/007X8olVly1g786i9e923j31400u078p.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'http://tva1.sinaimg.cn/large/007X8olVly1g786i9e923j31400u078p.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'http://tva1.sinaimg.cn/large/007X8olVly1g786i9rs01j31at0psdgh.jpg'
    }],

    //用户的信息
    openid:"",


    //这里不写第一次启动展示的时候会有问题
    // 目前轮播图显示的位置
    swiperCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');
    // 登录
    this.login();
    // 获取手机屏幕可用高度
    this.getPhoneHight();
  },


  onShow: function (options) {
    this.login();
  },



  // 获取手机屏幕可用高度
  getPhoneHight:function(){
    try {
      var res = wx.getSystemInfoSync()
      // var windowHeight = res.windowHeight
      var windowHeight = 0.88 * res.windowHeight - 10
      app.globalData.windowHeight=windowHeight
      console.log(app.globalData.windowHeight)
    } catch (e) { }
  },



  // 登录操作(从云上获取用户信息)
  login: function(){
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





  ////////////////////////////////轮播图 滑动控制////////////////////////////////
  // cardSwiper
  cardSwiper: function(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper: function(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  ////////////////////////////////轮播图 滑动控制////////////////////////////////



  // 改变现在的图片点
  swiperChange: function(e) {
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
  jumpToList: function (e) {
    var tab_id = 0
    var category_id = 0
    // 判断跳转的选项卡
    switch (e.currentTarget.id) {
      case "secondHand":
        tab_id = 0;
        break;
      case "express":
        tab_id = 1;
        break;
      case "help":
        tab_id = 2;
        category_id = 0;
        break;
      case "find":
        tab_id = 2;
        category_id = 1;
        break;
      case "team":
        tab_id = 2;
        category_id = 2;
        break;
      case "coupon":
        // 优惠券直接设置路径
        url = "../coupon/coupon"
    }
    if (e.currentTarget.id != "coupon") {
      url = "../goods/goods?tab_id=" + tab_id + "&category_id=" + category_id
    }
    wx.navigateTo({
      // url:"../goods/goods?tab_id=" + tab_id + "&category_id=" + category_id
      // url:"../../BackUp/test/test" 
      url: url
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
  showModal:function(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 隐藏发布选择框
  hideModal:function(e) {
    this.setData({
      modalName: null
    })
  },






})