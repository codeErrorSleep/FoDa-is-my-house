var util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    // 判断是否为管理员
    admin: false,
    userData:[],
    //头像列表
    swiperList: [],
    openid:"",
  },

  onLoad: function () {
    // this.uploadUser()
    // 判断是否显示管理员页面
    this.showAdmin();
    // 初始化用户数据
    this.setData({
      swiperList: app.globalData.swiperList,
      userData:app.globalData.userCloudData
    })


  },






  onShow: function (options) {
    // this.uploadUser()
    // 判断是否显示管理员页面
    this.showAdmin();

    this.setData({
      swiperList: app.globalData.swiperList,
      userData: app.globalData.userCloudData
    })

    //获取用户的openid并设置为全局变量
    this.login();

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



  // 判断是否显示管理员入口
  showAdmin:function(){
    // 判断全局变量中用户的数据
    if(app.globalData.userCloudData.admin){
      this.setData({
        admin:true
      })
    }
  },


  // 跳转我的页面
  showMyGoods:function(e){
    console.log(e.currentTarget.id)
    if(e.currentTarget.id=="2"){
      wx.navigateTo({
        // url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
        url:"../../News/myDiscover/myDiscover?tab_id=" +e.currentTarget.id
      })
    }else if(e.currentTarget.id=="1"){
      wx.navigateTo({
        // url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
        url:"../../News/myExpress/myExpress?tab_id=" +e.currentTarget.id
      })
    }else if(e.currentTarget.id=="0"){
      wx.navigateTo({
        // url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
        url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
      })
    }
  },


  // 跳转管理员页面
  administrator:function(){
    wx.navigateTo({
      url:"../../Admin/admin_main/admin_main"
    })

  },

  //检查用户是否已经注册(决定点击跳转到的页面)
  checkUser:function(){
    console.log(this.data.userData)
    if (app.globalData.userCloudData.approve==="0") {
      wx.navigateTo({
        url:"../registered/registered"
      })
    }else {
      wx.navigateTo({
        url: "../userInfo/userInfo"
      })
    }
  },



  //联系客服
  getCustomer:function() {
    
    var images = ["cloud://yf-ab2989.7966-yf-ab2989-1258230310/联系客服图.jpg"]
    wx.previewImage({
      current: "cloud://yf-ab2989.7966-yf-ab2989-1258230310/联系客服图.jpg",  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  }
})
