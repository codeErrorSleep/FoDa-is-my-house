var util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {
    //快递数量
    express_num:"",
    //可选快递数量
    chooseNum:[1,2,3,4,5,6,7,8,9],
    //所选快递数量下标
    numIndex:0,

    //快递总重量
    express_weight:"",
    //可选快递总重量
    chooseWeight:["轻小件(如衣服，小盒子等)","中件(大于鞋盒)","大件(需要两手扛的)","超大件(壮汉或两人扛)"],
    //所选快递总重量下标
    weightIndex:0,

    //快递酬金
    express_pay:"",

    //快递取件地址
    express_pickUp:"",
    //可选快递取件地址
    choosePickUp:["中门中通","商业街菜鸟驿站","南门中国邮政"],
    //所选快递取件地址下标
    pickUpIndex:0,

    //快递收件地址
    express_destination:"",
    express_destination_1:"",
    express_destination_2:"",
    //可选快递收件地址
    chooseDestination:[["东区","西区"],["东一","东二","东三","东四"]],
    //所选快递收件地址下标
    destinationIndex:[0,0],

    //详细快递收件地址
    express_destination_detail:"",

    //送达起始日期
    startDate:"",

    //送达终点日期
    endDate: "",

    //送达日期
    express_date: "",

    //送达时间
    express_time:"",

    //快递取件人姓名
    express_name: "",

    //快递取件人手机号
    express_phone: "",

    //详细说明
    express_note:"",

    //警告
    warning:"",

    //验证状态
    mode: "",

  },

  onLoad: function (options) {
    // 判断当前用户是否为以注册用户
    util.isRegistered()
    var startDate = new Date()
    var endDate = new Date()
    endDate.setDate(startDate.getDate() + 2)
    this.setData({
      express_name: app.globalData.userCloudData.real_name,
      express_phone: app.globalData.userCloudData.phone,
      startDate: util.getDate(startDate),
      endDate: util.getDate(endDate),
    })
  },

  //选择快递数量
  numChange(e) {
    this.setData({
      numIndex: e.detail.value,
      express_num: this.data.chooseNum[e.detail.value],
    })
  },

  //选择快递总重量
  weightChange(e) {
    this.setData({
      weightIndex: e.detail.value,
      express_weight: this.data.chooseWeight[e.detail.value],
    })
  },

  //报酬金额提示
  payNote(e) {
    this.setData({
      warning: "",
      modalName:"Modal",
    })
  },

  //隐藏模态窗口
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //选择快递取件地址
  pickUpChange(e) {
    this.setData({
      pickUpIndex: e.detail.value,
      express_pickUp: this.data.choosePickUp[e.detail.value],
    })
  },

  //选择快递收件地址
  destinationChange(e) {
    this.setData({
      destinationIndex: e.detail.value
    })
  },

  //选择快递收件地址
  destinationChange_column(e) {
    let data = {
      chooseDestination: this.data.chooseDestination,
      destinationIndex: this.data.destinationIndex
    };
    data.destinationIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.destinationIndex[0]) {
          case 0:
            data.chooseDestination[1] = ['东一', '东二', '东三', '东四'];
            break;
          case 1:
            data.chooseDestination[1] = ['西一', '西二', '西三', '西四'];
            break;
        }
        data.destinationIndex[1] = 0;
        break;
    }
    this.setData(data);
    this.setData({
      express_destination: this.data.chooseDestination[0][this.data.destinationIndex[0]] + " " + this.data.chooseDestination[1][this.data.destinationIndex[1]],
      express_destination_1: this.data.chooseDestination[0][this.data.destinationIndex[0]],
      express_destination_2: this.data.chooseDestination[1][this.data.destinationIndex[1]],
    });
  },

  // 选择快递送达日期
  dateChange(e) {
    this.setData({
      express_date: e.detail.value
    })
  },

  // 选择快递送达时间
  timeChange(e) {
    this.setData({
      express_time: e.detail.value
    })
  },

  //统计文本域字数
  bindInput(e) {
    var inputLength = e.detail.value.length;
    this.setData({
      inputLength: inputLength,
    })
  },

  //提交表单
  uploadPost(e) {
    if (e.detail.value.express_name!="") {
      this.setData({
        express_name: e.detail.value.express_name
      })
    }

    if (e.detail.value.express_phone != "") {
      this.setData({
        express_phone: e.detail.value.express_phone
      })
    }

    this.setData({
      express_pay:e.detail.value.express_pay,
      express_destination_detail:e.detail.value.express_destination_detail,
      express_note:e.detail.value.express_note,
      warning:"",
      mode: false,
    })

    console.log(this.data.express_num)
    console.log(this.data.express_weight)
    console.log(this.data.express_pay)
    console.log(this.data.express_pickUp)
    console.log(this.data.express_destination_1)
    console.log(this.data.express_destination_2)
    console.log(this.data.express_destination_detail)
    console.log(this.data.express_date)
    console.log(this.data.express_time)
    console.log(this.data.express_name)
    console.log(this.data.express_phone)
    console.log(this.data.express_note)

    this.checkInfo();

    if (this.data.mode) {
      this.uploadData();
    }
  },

  //检查是否有空值
  checkInfo() {
    if (this.data.express_num == "") {
      this.setData({
        warning: "请选择快递件数"
      })
    } else if (this.data.express_weight == ""){
      this.setData({
        warning: "请选择快递总重量"
      })
    } else if (this.data.express_pay == "") {
      this.setData({
        warning: "请输入报酬金额"
      })
    } else if (this.data.express_pickUp == "") {
      this.setData({
        warning: "请选择快递取件地址"
      })
    } else if (this.data.express_destination_1 == "" || this.express_destination_2 == "") {
      this.setData({
        warning: "请选择快递收件地址"
      })
    } else if (this.data.express_destination_detail == "") {
      this.setData({
        warning: "请输入您的详细收件地址"
      })
    } else if (this.data.express_date == "") {
      this.setData({
        warning: "请选择送达日期"
      })
    } else if (this.data.express_time == "") {
      this.setData({
        warning: "请选择送达时间"
      })
    } else if (this.data.express_time == "" || (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.express_phone)))) {
      this.setData({
        warning: "请输入正确的手机号码"
      })
    } else{
      this.setData({
        warning: "发布成功",
        mode: true,
      })
    }
    this.setData({
      modalName: "Modal",
    })
  },

  //上传数据
  uploadData: function () {
    // 送达截止时间戳
    var deadline_timeStamp = new Date(this.data.express_date + " " + this.data.express_time).getTime()
    var date = new Date()
    const db = wx.cloud.database()
    db.collection("express").add({
      data: {
        "num": this.data.express_num,
        "weight": this.data.express_weight,
        "price": this.data.express_pay,
        "pickUp": this.data.express_pickUp,
        "destination_1": this.data.express_destination_1,
        "destination_2": this.data.express_destination_2,
        "destination_detail": this.data.express_destination_detail,
        "deadline_date": this.data.express_date,
        "deadline_time": this.data.express_time,
        "deadline_timeStamp": deadline_timeStamp,
        "real_name": this.data.express_name,
        "phone": this.data.express_phone,
        "note": this.data.express_note,
        "date": date,
        "receiver_openid": "",
      },
      success(res) {
        console.log("插入成功")
        wx.showToast({
          title: '成功上传',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
})