const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
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
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
    //选择的头像的url
    chooseImg: "",
    //昵称
    nick_name: "",
    //姓名
    real_name: "",
    //微信号
    wechat_id: "",
    //手机号码
    phone: "",
    //验证码
    code: "",
    //正确验证码
    rightcode: "",
    //校园卡照片
    imgList: [],
  },
  onLoad() {
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');
    this.setData({
      chooseImg: this.data.swiperList[3].url
    })
    console.log('chooseImg:', this.data.chooseImg)
  },
  //选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
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
  //删除图片
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
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
          chooseImg: list[i].url
        })
      }
    }
    console.log('chooseImg:',this.data.chooseImg)
  },
  //获取手机号
  getPhone(e) {
    var data = e.detail.value;
    this.setData({
      phone: data
    })
  },
  //检测手机号
  checkPhone() {
    if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phone))) {
      return true; 
    }
    return false;
  },
  //获取验证码
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
        message: '你的验证码为:' + this.data.rightcode,
        number: this.data.phone,
        messageId: ''
      },
      success(res) {
        console.log(res.result.body)
      },
      fail: console.error
    })
  },
  //发送验证码
  sendCode(e) {
    if (!this.checkPhone()) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else {
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
  //提交表单
  formSubmit(e) {
    this.setData({
      nick_name: e.detail.value.nick_name,
      real_name: e.detail.value.real_name,
      wechat_id: e.detail.value.wechat_id,
      phone: e.detail.value.phone,
      code: e.detail.value.code,
      formId: e.detail.formId
    })
    console.log(this.data.chooseImg);
    console.log(this.data.nick_name);
    console.log(this.data.real_name);
    console.log(this.data.wechat_id);
    console.log(this.data.phone);
    console.log(this.data.code);
    console.log(this.data.imgList[0]);
    console.log(this.data.formId);
  },
})