// pages/test2/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //验证按钮状态
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    //手机验证信息
    code:'',
    rightcode:'',
    //用户信息
    phone:'',
    name:'',
    real_name:'',
    wechat_id:''
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

  //手机号输入
  bindPhoneInput(e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    })
    this.setData({
      hidden: false,
      btnValue: '获取验证码'
    })
  },



  //调用云函数,获取短信验证码
  getCode(e) {
    var Num = "";
    //生成随机验证码
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    this.setData({
      rightcode: Num
    })
    console.log('获取验证码');
    var that = this;
    //云函数
    wx.cloud.callFunction({
      // 云函数名称
      name: 'zhenzisms',
      // 传给云函数的参数
      data: {
        $url: 'send',
         apiUrl: 'https://sms_developer.zhenzikj.com',
        appId: '101695',
        appSecret: 'b45001fd-1825-4b6a-a189-4d88f41065b4',
        message: '你的验证码为:'+this.data.rightcode,
        number: this.data.phone,
        messageId: ''
      },
      success(res) {
        console.log(res.result.body)
      },
      fail: console.error
    })
  },

  getUserData:function(e){
    //得到用户填写的信息
    this.setData({
      name:e.detail.value.name,
      real_name:e.detail.value.real_name,
      wechat_id:e.detail.value.wechat_id,
      code:e.detail.value.code
    })

    if(this.data.code !=this.data.rightcode){
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
    }else{
      console.log("shangchuang")
      this.uploadUser()
    }
    

  },


  uploadUser:function(){
    console.log("shangchuang")
    const db = wx.cloud.database()
    db.collection("users").add({
      data:{
        "name":this.data.name,
        "real_name":this.data.real_name,
        "wechat_id":this.data.wechat_id,
        "phone_num":this.data.phone,
        "approve":"False"
      },
      success(res){
        //成功上传后提示信息
        console.log("上传成功")
        wx.showToast({
          title: '成功上传',
          icon: 'success',
          duration: 1000
        })

      }
    })


  }

})    