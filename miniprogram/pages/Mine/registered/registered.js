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
    wechat_id:'',
    // 用户formid 向要用户发送模板消息
    formId:'',
    //照片在云的位置
    approve_img:[],
    //存放照片在手机中的位置
    images:[]
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
      code:e.detail.value.code,
      formId:e.detail.formId
    })
    // 验证验证码信息是否正确
    // if(this.data.code !=this.data.rightcode){
    //   wx.showToast({
    //     title: '验证码错误',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // }else{
    //   console.log("shangchuang")
    //   this.uploadUser()
    // }
    

    console.log(this.data.name)
    console.log(this.data.real_name)
    console.log(this.data.wechat_id)
    console.log(this.data.phone)
    console.log(this.data.formId)



    // 添加用户信息上云
    this.uploadImages()


  },


  //上传用户图片信息
  uploadImages:function(){

    var images=this.data.images
    //先添加到这一变量,在最后一个再改变this.data.中的approve_img
    var approve_img=[]


    // 对用户点击的图片进行上传
    images.forEach(item => {
      console.log(item)
      wx.cloud.uploadFile({
        cloudPath: "approve_imgs/"+item.substring(item.length-20), // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          approve_img.push(res.fileID)
          console.log(approve_img)

          //获取所有图片在云端的位置后上传到数据库
          if(approve_img.length===images.length){
            //将局部变量赋给this.data
            this.setData({
              approve_img:approve_img
            })
            console.log(this.data.approve_img)
            //隐藏上传提示
            wx.hideLoading()
            this.uploadData()
          }
        },
        fail: console.error
      })
    });
  },



  // 将用户信息上传到数据库
  uploadData:function(){
    console.log("上传")
    const db = wx.cloud.database()
    db.collection("users").add({
      data:{
        "name":this.data.name,
        "real_name":this.data.real_name,
        "wechat_id":this.data.wechat_id,
        "phone_num":this.data.phone,
        "approve":"False",
        "approve_img":this.data.approve_img,
        "al_approve":"False",
        "formId":this.data.formId
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


  },


  //打开用户相册选择图片
  chooseImage:function(e){
    wx.chooseImage({
      sizeType: ['compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        this.setData({
          images:res.tempFilePaths
        })
        console.log(this.data.images)
      }
    })
  },

  //用户点击放大图片
  handleImagePreview:function(e) {
    const images = this.data.images
    wx.previewImage({
      current: images,  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  //点击删除移除照片
  removeImage:function(e) {
    //删除指定位置的照片
    this.setData({
      images:[]
    })
  },






})    