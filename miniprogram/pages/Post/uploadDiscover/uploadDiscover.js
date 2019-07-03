var util = require('../../../utils/util.js')
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择物品类型
    types:["求助","找队友","失物认领"],
    type_index:0,
    inputLength: 0, //文字输入框字数

    //用户上传的信息
    title:"",
    price:Number,
    type:"",
    content:"",
    //照片在云的位置
    discover_imgs:[],

    //存放照片在手机中的位置
    images:[],

    // 时间选择
    time: '12:01',
    date: '2019-9-1',
    startDate:"",
    endDate: "",
    deadline:"",  // 求助截止时间 存放 具体时间 yyyy-mm-dd hh:mm
    timeStamp:"", // 求助截止时间 存放时间戳
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 对求助开始时间和结束时间的处理
    var startDate=new Date()
    var endDate=new Date()
    endDate.setDate(startDate.getDate()+10)
    this.setData({
      startDate:util.getDate(startDate),
      endDate:util.getDate(endDate)
    })
    // console.log(this.data.startDate)
    // console.log(this.data.endDate)
  },


  //统计文本域字数
  bindInput: function(e) {
    var inputLength = e.detail.value.length;
    this.setData({
      inputLength: inputLength,
    })
  },

  //判断物品的类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value,
      type:this.data.types[e.detail.value]
    })
  },

  //处理用户填写信息并准备上传
  uploadPost:function(e){
    wx.showLoading({
      title: '正在上传...',
      mask: true
    })

    //得到用户填写的信息
    this.setData({
      title:e.detail.value.title,
      price:e.detail.value.price,
      content:e.detail.value.content,
    })

    // 先将照片上传再上传数据库
    if(this.data.images===0){
      console.log("没有上传图片")
      this.uploadData()
    }else{
      this.uploadImages()
    }
  },

  //将帖子信息上传到数据库
  uploadData:function(){
    // 发帖时间
    var date=new Date()
    // 求助截止时间
    var deadline=this.data.date+" "+this.data.time
    // 将截止时间转换为时间戳
    this.setData({
      timeStamp:new Date(deadline).getTime(),
      deadline:deadline
    })
    const db = wx.cloud.database()
    db.collection("discover").add({
      data:{
        "content":this.data.content,
        "imgs":this.data.discover_imgs,
        "price":this.data.price,
        "title":this.data.title,
        "type":this.data.type,
        "date":date,
        "type":this.data.types[this.data.type_index],
        "timeStamp":this.data.timeStamp,
        "deadline":this.data.deadline,
      },
      success(res){
        //成功上传后提示信息
        console.log("插入成功")

        wx.showToast({
          title: '成功上传',
          icon: 'success',
          duration: 1000
        })
      }
    })

    
  },

  //上传物品图片信息
  uploadImages:function(){

    var images=this.data.images
    //先添加到这一变量,在最后一个再改变this.data.中的discover_imgs
    var discover_imgs=[]

    images.forEach(item => {
      console.log(item)
      wx.cloud.uploadFile({
        cloudPath: "discover_imgs/"+item.substring(item.length-20), // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          discover_imgs.push(res.fileID)
          console.log(discover_imgs)

          //获取所有图片在云端的位置后上传到数据库
          if(discover_imgs.length===images.length){
            //将局部变量赋给this.data
            this.setData({
              discover_imgs:discover_imgs
            })
            console.log(this.data.discover_imgs)
            //隐藏上传提示
            wx.hideLoading()
            this.uploadData()
          }
        },
        fail: console.error
      })
    });
  },


  //选择图片
  chooseImage: function(e) {
    var that = this;
    if (that.data.images.length < 3) {
      wx.chooseImage({
        count: 3, //最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setData({
            images:this.data.images.concat(res.tempFilePaths)
          })
          console.log(this.data.images)
        }
      });
    } else {
      wx.showToast({
        title: "图片限传三张！",
        icon: 'none',
        duration: 2000,
        mask: true,
      });
    }
  },

  //用户点击放大图片
  handleImagePreview:function(e) {
    var index = e.target.dataset.index
    var images = this.data.images
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  //点击删除移除照片
  removeImage:function(e) {
    var index = e.target.dataset.index
    //删除指定位置的照片
    var images=this.data.images
    images.splice(index,1)
    this.setData({
      images:images
    })
    console.log(index)
    console.log(this.data.images)
  },

  // 选择时间的变化函数
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
    console.log(this.data.time)
  },

  // 选择日期的变化函数
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })

  },

})    