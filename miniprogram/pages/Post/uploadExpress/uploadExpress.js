var util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {
    //快递数量
    express_num: 1,
    //可选快递数量
    chooseNum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    //所选快递数量下标
    numIndex: 0,

    //快递总重量
    express_weight: "轻小件",
    //可选快递总重量
    chooseWeight: ["轻小件", "中件", "大件", "超大件"],
    //所选快递总重量下标
    weightIndex: 0,

    //快递酬金
    express_pay: "",

    //快递取件地址
    express_pickUp: "江湾 大成楼中通",
    express_pickUp_1: "江湾",
    express_pickUp_2: "大成楼中通",
    //可选快递取件地址
    choosePickUp: [["江湾", "仙溪", "河滨"], ["大成楼中通", "大成楼申通", "大成楼唯品会", "大成楼当当", "大成楼天猫", "大成楼京东", "大成楼苏宁", "顺丰", "商业街菜鸟驿站", "南门中国邮政", "移动店", "中区百世", "中区圆通"]],
    //所选快递取件地址下标
    pickUpIndex: [0, 0],
    //快递收件地址
    express_destination: "江湾 东区 东一",
    express_region: "江湾",
    express_destination_1: "东区",
    express_destination_2: "东一",
    //可选快递收件地址
    chooseDestination: [["江湾", "仙溪", "河滨"], ["东区", "西区", "中区", "南区", "国交", "其他"], ["东一", "东二", "东三", "东四", "东五", "东六", "东七", "东八", "东九"]],
    //所选快递收件地址下标
    destinationIndex: [0, 0, 0],

    //详细快递收件地址
    express_destination_detail: "",

    //送达起始日期
    startDate: "",

    //送达终点日期
    endDate: "",

    //送达日期
    express_date: "",

    //送达时间
    express_time: "",

    //快递取件人姓名
    express_name: "",
    ori_express_name: "",

    //快递取件人微信号
    express_wechat: "",
    ori_express_wechat: "",

    //快递取件人手机号
    express_phone: "",
    ori_express_phone: "",

    //快递取件码
    express_code: "",

    //详细说明
    express_note: "",

    //警告
    warning: "",

    //检验填写信息是否完整(boolean)
    infoMode: false,
    // 检验订阅消息是否通过
    messageMode:false,

    // 辨别用户第几次点击发布
    display:true,

    //判断用户是否更改姓名
    changeName: false,
  },

  onLoad: function (options) {
    // 判断当前用户是否为以注册用户
    util.isRegistered()
    var startDate = new Date()
    var endDate = new Date()
    endDate.setDate(startDate.getDate() + 2)
    this.setData({
      express_wechat: app.globalData.userCloudData.wechat_id,
      express_phone: app.globalData.userCloudData.phone,
      ori_express_name: app.globalData.userCloudData.real_name,
      ori_express_wechat: app.globalData.userCloudData.wechat_id,
      ori_express_phone: app.globalData.userCloudData.phone,
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
      warning: "pay",
      modalName: "Modal",
    })
  },

  //隐藏模态窗口
  hideModal(e) {
    this.setData({
      modalName: null,
      warning:""
    })
  },

  //选择快递取件地址
  pickUpChange(e) {
    this.setData({
      pickUpIndex: e.detail.value
    })
  },

  //选择快递取件地址
  pickUpChange_column(e) {
    let data = {
      choosePickUp: this.data.choosePickUp,
      pickUpIndex: this.data.pickUpIndex
    };
    data.pickUpIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.pickUpIndex[0]) {
          case 0:
            data.choosePickUp[1] = ["大成楼中通", "大成楼申通", "大成楼唯品会", "大成楼当当", "大成楼天猫", "大成楼京东", "大成楼苏宁", "顺丰", "商业街菜鸟驿站", "南门中国邮政", "移动店", "中区百世", "中区圆通"];
            break;
          case 1:
            data.choosePickUp[1] = ["北区", "南区"];
            break;
          case 2:
            data.choosePickUp[1] = ["正门", "后门"];
            break;
        }
        data.pickUpIndex[1] = 0;
        break;
    }
    this.setData(data);
    this.setData({
      express_pickUp: this.data.choosePickUp[0][this.data.pickUpIndex[0]] + " " + this.data.choosePickUp[1][this.data.pickUpIndex[1]],
      express_pickUp_1: this.data.choosePickUp[0][this.data.pickUpIndex[0]],
      express_pickUp_2: this.data.choosePickUp[1][this.data.pickUpIndex[1]],
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
            data.chooseDestination[1] = ["东区", "西区"];
            data.chooseDestination[2] = ["东区", "西区", "中区", "南区", "国交", "其他"];
            break;
          case 1:
            data.chooseDestination[1] = ["一区", "二区"];
            data.chooseDestination[2] = ["一楼", "二楼", "三楼", "四楼"];
            break;
          case 2:
            data.chooseDestination[1] = ["A区", "B区"];
            data.chooseDestination[2] = ["一栋", "二栋", "三栋", "四栋"];
            break;
        }
        data.destinationIndex[1] = 0;
        data.destinationIndex[2] = 0;
        break;
      case 1:
        switch (data.destinationIndex[0]) {
          case 0:
            switch (data.destinationIndex[1]) {
              case 0:
                data.chooseDestination[2] = ["东一", "东二", "东三", "东四", "东五", "东六", "东七", "东八", "东九"];
                break;
              case 1:
                data.chooseDestination[2] = ["全部", "西一", "西二", "西三", "西四", "研究生A栋", "研究生B栋", "研究生C栋", "研究生D栋", "英语村"];
                break;
              // 后面需要补上中区南区等位置
              case 2:case 3:case 4:case 5:
                data.chooseDestination[2]=[]
                break;
            }
            break;
          case 1:
            switch (data.destinationIndex[1]) {
              case 0:
                data.chooseDestination[2] = ["一楼", "二楼", "三楼", "四楼"];
                break;
              case 1:
                data.chooseDestination[2] = ["五楼", "六楼", "七楼", "八楼"];
                break;
            }
            break;
          case 2:
            switch (data.destinationIndex[1]) {
              case 0:
                data.chooseDestination[2] = ["一栋", "二栋", "三栋", "四栋"];
                break;
              case 1:
                data.chooseDestination[2] = ["五栋", "六栋", "七栋", "八栋"];
                break;
            }
            break;
        }
        data.destinationIndex[2] = 0;
        break;
    }
    this.setData(data);
    this.setData({
      express_destination: this.data.chooseDestination[0][this.data.destinationIndex[0]] + " " + this.data.chooseDestination[1][this.data.destinationIndex[1]] + " " + this.data.chooseDestination[2][this.data.destinationIndex[2]],
      express_region: this.data.chooseDestination[0][this.data.destinationIndex[0]],
      express_destination_1: this.data.chooseDestination[1][this.data.destinationIndex[1]],
      express_destination_2: this.data.chooseDestination[2][this.data.destinationIndex[2]],
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



  // 提示用户选择订阅信息
  showMessageModal:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '请允许我们选你发送快递通知,方便追踪快递走向',
      success (res) {
        // that.getMessage();
        that.getMessage();
      }
    })

  },

  // 弹框获取发送订阅消息权限
   getMessage:function(){
     var that= this
     wx.requestSubscribeMessage({
      tmplIds: ['mYNAHVympU1Q5A_k914VwqMAmAdWdDpdCWzmBNcV4s4'],
      success (res) {
        console.log("订阅成功")
    // 订阅弹框完成后上传数据
        that.uploadData();
    // 判断是否修改姓名
        if (that.data.changeName) {
          that.changeUsername();
        }
      },
      fail(err) {
        that.uploadData();
    // 判断是否修改姓名
        if (that.data.changeName) {
          that.changeUsername();
        }
      },
    })
    // 点击订阅消息后上传数据
    // this.setData({
    //   messageMode:true
    // })



  },





  // 检查用户个人信息
  checkUserInfo:function(e){
    if (e.detail.value.express_name != "") {
      this.setData({
        express_name: e.detail.value.express_name,
        changeName: true,
      })
    } else if (this.data.ori_express_name != null) {
      this.setData({
        express_name: this.data.ori_express_name
      })
    }

    if (e.detail.value.express_wechat != "") {
      this.setData({
        express_wechat: e.detail.value.express_wechat
      })
    } else {
      this.setData({
        express_wechat: this.data.ori_express_wechat
      })
    }

    if (e.detail.value.express_phone != "") {
      this.setData({
        express_phone: e.detail.value.express_phone
      })
    } else {
      this.setData({
        express_phone: this.data.ori_express_phone
      })
    }

    this.setData({
      express_destination_detail: e.detail.value.express_destination_detail,
      express_note: e.detail.value.express_note,
      express_code: e.detail.value.express_code,
      express_pay: e.detail.value.express_pay,
    })
  },


  //检查是否有空值
  checkExpressInfo:function() {
    if (this.data.express_num == "") {
      this.setData({
        warning: "请选择快递件数"
      })
    } else if (this.data.express_weight == "") {
      this.setData({
        warning: "请选择快递总重量"
      })
    } else if (this.data.express_pay == "") {
      this.setData({
        warning: "请输入报酬金额"
      })
    } else if (this.data.express_pickUp_2 == "") {
      this.setData({
        warning: "请选择快递取件地址"
      })
    } else if (this.data.express_region == "" || this.data.express_destination_1 == "" || this.express_destination_2 == "") {
      this.setData({
        warning: "请选择快递收件地址"
      })
    } else if (this.data.express_region != this.data.express_pickUp_1) {
      this.setData({
        warning: "取件地址必须与收件地址的校区一致"
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
    } else if (new Date(this.data.express_date + " " + this.data.express_time).getTime() < new Date().getTime()) {
      this.setData({
        warning: "确保送达时间晚于现在时间"
      })
    } else if (this.data.express_name == "") {
      this.setData({
        warning: "姓名不能为空",
      })
    }
    // 先不检验微信号的正确性（注册于个人信息那里需要修改）
    // else if (this.data.express_wechat == "" || (!(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/.test(this.data.express_wechat)))) {
    //   this.setData({
    //     warning: "请输入正确的微信号",
    //   })
    // }
    else if (this.data.express_phone == "" || (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.express_phone)))) {
      this.setData({
        warning: "请输入正确的手机号码"
      })
    } else {
      this.setData({
        // warning: "发布成功",
        infoMode: true,
        display:false
      })
    }
    if(this.data.warning!=""){
      this.setData({
        modalName: "Modal",
      })
    }
  },


  //验证微信号等信息
  uploadPost(e) {
    // 检查用户个人信息
    this.checkUserInfo(e);
    //检查是否有空值
    this.checkExpressInfo();
    // 填写信息完整则准备上传
    if(this.data.infoMode){
      this.showMessageModal();
    }

    // 注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 将上传数据操作放到showMessageModal后调用
    // 再处理完异步操作后统一放回这里地调用
    // 注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // if(isUpload){
    //   console.log(isUpload)
      // this.uploadData();
      // // 判断是否修改姓名
      // if (this.data.changeName) {
      //   this.changeUsername();
      // }
    // }
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
        "pickUp": this.data.express_pickUp_2,
        "region": this.data.express_region,
        "destination_1": this.data.express_destination_1,
        "destination_2": this.data.express_destination_2,
        "destination_detail": this.data.express_destination_detail,
        "deadline_date": this.data.express_date,
        "deadline_time": this.data.express_time,
        "deadline_timeStamp": deadline_timeStamp,
        "real_name": this.data.express_name,
        "wechat_id": this.data.express_wechat,
        "phone": this.data.express_phone,
        "note": this.data.express_note,
        "date": date,
        'accepter_openid': "",
        'code': this.data.express_code,
      },
      success(res) {
        console.log("插入成功")
        wx.showToast({
          title: '成功上传',
          icon: 'success',
          duration: 1000
        })

        wx.redirectTo({
          url: "../../Index/goods/goods?tab_id=" + 1
        })

      }
    })
  },

  //更新用户名
  changeUsername:function() {
    console.log("上传数据")
    const db = wx.cloud.database()
    db.collection("users").doc(app.globalData.userCloudData._id).update({
      data: {
        "real_name": this.data.express_name,
      },
      success: function (res) {
        //成功上传后提示信息
        console.log("上传成功")
        wx.showLoading({
          title: '成功上传',
          icon: 'success',
          duration: 1000,

        })
        wx.navigateBack({})
      }
    })
  },

})