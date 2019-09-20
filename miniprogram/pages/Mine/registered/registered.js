const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    //头像列表
    swiperList: [],
    //头像索引
    head_index: "",
    //昵称
    nick_name: "",
    //姓名
    real_name: "",
    //校区索引
    region_index: null,
    //校区选择
    choose: ["江湾", "仙溪", "河滨"],
    //微信号
    wechat_id: "",
    //手机号码
    phone: "",
    //验证码
    code: "",
    //正确验证码
    rightcode: "",
    //存放照片在手机中的位置
    imgList: [],
    //照片在云的位置
    approve_img: [],
    // 用户formid 向要用户发送模板消息
    formId: "",
    //警告
    warning: "",
    //验证码限时
    second: 60,
    //验证码按钮内容
    btnValue: '验证码',
    //验证码按钮状态
    btnDisabled: false,
  },
  onLoad() {
    this.setData({
      swiperList: app.globalData.swiperList
    })
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');
    this.setData({
      head_index: this.data.swiperList[3].id
    })
    console.log('head_index:', this.data.head_index)
  },
  //选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  //显示图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
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


  //删除图片
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除该图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
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
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
    //zIndex=4 ,mLeft=0为中心图片
    var that = this;
    for (let i = 0; i < list.length; i++) {
      if (list[i].mLeft == 0) {
        that.setData({
          head_index: list[i].id
        })
      }
    }
    console.log('head_index:', this.data.head_index)
  },
  //选择校区
  RegionChange: function (e) {
    this.setData({
      region_index: e.detail.value,
    })
  },
  //获取手机号
  getPhone(e) {
    var Num = "";
    //生成随机验证码
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    var data = e.detail.value;
    this.setData({
      phone: data,
      rightcode: Num
    })
  },

 //验证码限时
 timer: function () {
  console.log('get in');
  let promise = new Promise((resolve, reject) => {
    let setTimer = setInterval(
      () => {
        var second = this.data.second - 1;
        this.setData({
          second: second,
          btnValue: second + '秒',
          btnDisabled: true
        })
        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            btnValue: '验证码',
            btnDisabled: false
          })
          resolve(setTimer)
        }
      }
      , 1000)
  })
  promise.then((setTimer) => {
    clearInterval(setTimer)
  })
},

  //获取验证码
  getCode(e) {
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
        message: '你的验证码为:' + this.data.rightcode,
        number: this.data.phone,
        messageId: ''
      },
      success(res) {
        console.log(res.result.body)
        if (res.result.body.code == 0) {
          that.timer();
          return;
        }
      },
      fail: console.error
    })
  },
  //发送验证码
  async sendCode(e) {
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phone))) {
      this.setData({
        warning: "请输入正确的手机号码",
        modalName: e.currentTarget.dataset.target,
      })
    }else if (await this.checkDB('phone', this.data.phone)){
      this.setData({
        warning: "手机号码已被注册",
        modalName: e.currentTarget.dataset.target,
      })
    }else {
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 1000
      })
      console.log("code sending");
      this.getCode(e);
    }
  },
  //隐藏模态窗口
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //数据库查重
  checkDB(key,value) {
    return new Promise((resolve,reject)=>{
      const db = wx.cloud.database()
      db.collection('users')
        .where({
          [key]: value,
        })
        .limit(1)
        .get({
          success: function (res) {
            if (res.data.length > 0) {
              resolve(true)
            }else {
              resolve(false)
            }
          }
        })
    })
  },
  //检验数据
  async checkInfo() {
    this.setData({
      isLoad: true,
    })
    wx.showLoading({
      title: '正在验证',
      icon: 'loading',
    })
    if (this.data.nick_name == "") {
      this.setData({
        warning: "昵称不能为空",
      })
    } else if (await this.checkDB('nick_name', this.data.nick_name)){
      this.setData({
        warning: "昵称已被注册",
      })
    } else if (this.data.real_name == "") {
      this.setData({
        warning: "姓名不能为空",
      })
    } else if (this.data.region_index == null) {
      this.setData({
        warning: "校区不能为空",
      })
    } else if (this.data.wechat_id == "") {
      this.setData({
        warning: "微信号不能为空",
      })
    } 
    // 先不让用户输入微信号（此段代码在userinfo中也与快递那里都有，修改一同修改）
    // else if (!(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/.test(this.data.wechat_id))) {
    //   this.setData({
    //     warning: "请输入正确的微信号",
    //   })
    // } 
    else if (await this.checkDB('wechat_id', this.data.wechat_id)) {
      this.setData({
        warning: "微信号已被注册",
      })
    } else if (this.data.phone == "") {
      this.setData({
        warning: "手机号码不能为空",
      })
    } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phone))) {
      this.setData({
        warning: "请输入正确的手机号",
      })
    } else if (await this.checkDB('phone', this.data.phone)) {
      this.setData({
        warning: "手机号码已被注册",
      })
    } else if (this.data.imgList.length == 0) {
      this.setData({
        warning: "请上传校园卡",
      })
    } else if (this.data.code == "" || (this.data.code != this.data.rightcode)){
      this.setData({
        warning: "验证码错误",
      })
    } else {
      this.setData({
        warning: "提交成功",
      })
      //上传数据
      this.uploadImages()
    }
    wx.hideLoading()
    this.setData({
      modalName: "Modal",
      isLoad: false,
    })
  },
  //提交表单
  formSubmit(e) {
    this.setData({
      nick_name: e.detail.value.nick_name,
      real_name: e.detail.value.real_name,
      wechat_id: e.detail.value.wechat_id,
      phone: e.detail.value.phone,
      code: e.detail.value.code,
      formId: e.detail.formId,
      warning: "",
    })

    console.log(this.data.head_index);
    console.log(this.data.nick_name);
    console.log(this.data.real_name);
    console.log(this.data.region_index);
    console.log(this.data.wechat_id);
    console.log(this.data.phone);
    console.log(this.data.code);
    console.log(this.data.imgList[0]);
    console.log(this.data.formId);

    this.checkInfo()

  },
  //上传数据
  uploadData() {
    console.log("上传数据")
    const db = wx.cloud.database()
    db.collection("users").add({
      data: {
        "head_index": this.data.head_index,
        "nick_name": this.data.nick_name,
        "real_name": this.data.real_name,
        "region_index": this.data.region_index,
        "wechat_id": this.data.wechat_id,
        "phone": this.data.phone,
        "approve_img": this.data.approve_img,
        "formId": this.data.formId,
        "approve": false,
        "al_approve": false,
      },
      success: function(res) {
        //成功上传后提示信息
        console.log("上传成功")
        wx.showLoading({
          title: '成功上传',
          icon: 'success',
          duration: 1000
        })
        wx.navigateBack({})
      }
    })
  },
  //上传用户图片信息
  uploadImages() {
    console.log("上传图片")
    var images = this.data.imgList
    //先添加到这一变量,在最后一个再改变this.data.中的approve_img
    var approve_img = []
    // 对用户点击的图片进行上传
    images.forEach(item => {
      console.log(item)
      wx.cloud.uploadFile({
        cloudPath: "approve_imgs/" + item.substring(item.length - 20), // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          approve_img.push(res.fileID)
          console.log(approve_img)
          //获取所有图片在云端的位置后上传到数据库
          if (approve_img.length === images.length) {
            //将局部变量赋给this.data
            this.setData({
              approve_img: approve_img
            })
            console.log(this.data.approve_img)

            this.uploadData()
          }
        },
        fail: console.error
      })
    });
  },
})