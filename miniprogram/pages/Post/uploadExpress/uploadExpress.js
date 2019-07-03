var util = require('../../../utils/util.js')
var app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择物品数量
    nums: [1,2,3,4,5,6,7,8,9],
    num_index: 0,
    //选择物品重量
    weights: ['轻小件(轻小包装商品)','中件(稍重或稍大包装的商品)','大件(较重或较大包装的商品)','超大件(非常重或非常大包装的商品)'],
    weight_index: 0,
    //选择物品取件地址
    takes: ['快递点1', '快递点2', '快递点3', '快递点4', '快递点5', '快递点6','快递点7'],
    take_index: 0,
    //选择物品收件地址
    brings: [['东区', '西区'], ['东一', '东二', '东三','东四']],
    bring_index: [0,0],
    //送达时间
    time:'12:01',
    regions: ["江湾", "仙溪", "河滨"],
    region_index: 0,
    //文字输入框字数
    inputLength: 0,

    //用户上传的信息
    post_title: "",
    goods_price: Number,
    goods_oriPrice: Number,
    goods_num: 1,
    goods_weight: '轻小件(轻小包装商品)',
    goods_take: '快递点1',
    goods_bring: '东区，东一',
    bring_detail: '',
    goods_region: "江湾",
    goods_content: "",
    //照片在云的位置
    goods_imgs: [],

    //存放照片在手机中的位置
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断当前用户是否为以注册用户
    util.isRegistered()
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

  //统计文本域字数
  bindInput: function (e) {
    var inputLength = e.detail.value.length;
    this.setData({
      inputLength: inputLength,
    })
  },

  //判断物品的数量
  bindNumChange: function (e) {
    this.setData({
      num_index: e.detail.value,
      goods_num: this.data.nums[e.detail.num]
    })
  },

  //判断物品的重量
  bindWeightChange: function (e) {
    this.setData({
      weight_index: e.detail.value,
      goods_weight: this.data.weights[e.detail.num]
    })
  },

  //判断物品的取件地址
  bindTakeChange: function (e) {
    this.setData({
      take_index: e.detail.value,
      goods_take: this.data.takes[e.detail.num]
    })
  },

  //判断物品的收件地址
  bindBringChange: function (e) {
    this.setData({
      bring_index: e.detail.value
    })
  },

  //判断物品的收件地址
  ColumnBringChange: function (e) {
    let data = {
      brings: this.data.brings,
      bring_index: this.data.bring_index
    };
    data.bring_index[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.bring_index[0]) {
          case 0:
            data.brings[1] = ['东一', '东二', '东三', '东四'];
            break;
          case 1:
            data.brings[1] = ['西一', '西二', '西三', '西四'];
            break;
        }
        data.bring_index[1] = 0;
        break;
    }
    this.setData(data);
  },

  //时间选取
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  //判断校区
  bindRegionChange: function (e) {
    this.setData({
      region_index: e.detail.value,
      goods_region: this.data.regions[e.detail.value]
    })
  },

  //处理用户填写信息并准备上传
  uploadPost: function (e) {
    wx.showLoading({
      title: '正在上传...',
      mask: true
    })

    //得到用户填写的信息
    this.setData({
      post_title: e.detail.value.post_title,
      goods_price: e.detail.value.goods_price,
      goods_content: e.detail.value.goods_content,
      oriPrice: e.detail.value.oriPrice
    })


    this.uploadImages()
  },

  //将帖子信息上传到数据库
  uploadData: function () {
    var date = new Date()
    const db = wx.cloud.database()
    db.collection("post").add({
      data: {
        "content": this.data.goods_content,
        "imgs": this.data.goods_imgs,
        "price": this.data.goods_price,
        "title": this.data.post_title,
        "type": this.data.goods_type,
        "region": this.data.goods_region,
        "oriPrice": this.data.oriPrice,
        "date": date
      },
      success(res) {
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
  uploadImages: function () {

    var images = this.data.images
    //先添加到这一变量,在最后一个再改变this.data.中的goods_imgs
    var goods_imgs = []

    images.forEach(item => {
      console.log(item)
      wx.cloud.uploadFile({
        cloudPath: "goods_imgs/" + item.substring(item.length - 20), // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          goods_imgs.push(res.fileID)
          console.log(goods_imgs)

          //获取所有图片在云端的位置后上传到数据库
          if (goods_imgs.length === images.length) {
            //将局部变量赋给this.data
            this.setData({
              goods_imgs: goods_imgs
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


  //选择图片
  chooseImage: function (e) {
    var that = this;
    if (that.data.images.length < 3) {
      wx.chooseImage({
        count: 3, //最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setData({
            images: this.data.images.concat(res.tempFilePaths)
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
  handleImagePreview: function (e) {
    var index = e.target.dataset.index
    var images = this.data.images
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  //点击删除移除照片
  removeImage: function (e) {
    var index = e.target.dataset.index
    //删除指定位置的照片
    var images = this.data.images
    images.splice(index, 1)
    this.setData({
      images: images
    })
    console.log(index)
    console.log(this.data.images)
  },




})    