// pages/test2/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择物品类型
    types:["其他","生活","学习","衣服"],
    type_index:0,

    //用户上传的信息
    post_title:"",
    goods_price:Number,
    goods_type:"",
    goods_content:"",
    //照片在云的位置
    goods_imgs:[],

    //存放照片在手机中的位置
    images:[]
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

  //判断物品的类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value,
      goods_type:this.data.types[e.detail.value]
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
      post_title:e.detail.value.post_title,
      goods_price:e.detail.value.goods_price,
      goods_content:e.detail.value.goods_content,
    })

    // console.log(this.data.post_title)
    // console.log(this.data.goods_price)
    // console.log(this.data.goods_type)
    // 添加商品照片上云
    this.uploadImages()
  },

  //将帖子信息上传到数据库
  uploadData:function(){
    var date=new Date()
    const db = wx.cloud.database()
    db.collection("post").add({
      data:{
        "content":this.data.content,
        "imgs":this.data.goods_imgs,
        "price":this.data.goods_price,
        "title":this.data.post_title,
        "type":this.data.goods_type,
        "date":date
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
    //先添加到这一变量,在最后一个再改变this.data.中的goods_imgs
    var goods_imgs=[]

    images.forEach(item => {
      console.log(item)
      wx.cloud.uploadFile({
        cloudPath: "goods_imgs/"+item.substring(item.length-20), // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          goods_imgs.push(res.fileID)
          console.log(goods_imgs)

          //获取所有图片在云端的位置后上传到数据库
          if(goods_imgs.length===images.length){
            //将局部变量赋给this.data
            this.setData({
              goods_imgs:goods_imgs
            })
            console.log(this.data.goods_imgs)
            //隐藏上传提示
            wx.hideLoading()
            this.uploadData()
          }
        },
        fail: console.error
      })
    });
  },

  //打开用户相册选择图片
  chooseImage:function(e){
    wx.chooseImage({
      sizeType: ['compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        this.setData({
          images:this.data.images.concat(res.tempFilePaths)
        })
        console.log(this.data.images)
      }
    })
  },

  //用户点击放大图片
  handleImagePreview:function(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  //点击删除移除照片
  removeImage:function(e) {
    const idx = e.target.dataset.idx
    //删除指定位置的照片
    var images=this.data.images
    images.splice(idx,1)
    this.setData({
      images:images
    })
    console.log(idx)
    console.log(this.data.images)
  },










})    