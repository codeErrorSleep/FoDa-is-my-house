var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //主导航栏
    navbar: ["闲置", "快递", "发现"],
    //闲置分类导航栏
    categories: ["全部", "化妆类", "电器类", "学习类", "衣物类", "生活类"],
    //主导航栏下标
    currentIndex: 0,
    //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'post',
    //数据库数量
    count: "",
    //数据库数据
    feed: [],
    // 快递中已接单的帖子
    accFeed: [],
    //下拉更新数据库数据个数
    nextPage: 0,
    nextPage1: 0,
    //我的页面
    myPage: false,
    // 现在的时间戳 (暂时,添加到全局变量)
    nowDate: 0,
    //酬金
    price: ["全部","酬金由低到高","酬金由高到低"],
    //全部校区
    allRegion1: {"全部":{"":[""]},"江湾":{"全部":[""],"东区":["全部","东一","东二","东三","东四","东五","东六","东七","东八","东九"],"西区":["全部","西一","西二","西三","西四","研究生A栋","研究生B栋","研究生C栋","研究生D栋","英语村"],"中区":["全部"],"南区":["全部"],"国交":["全部"],"其他":["全部"],},"仙溪":{"全部":[""],"一区":["全部","一楼","二楼","三楼","四楼"],"二区":["全部","五楼","六楼","七楼","八楼"]},"河滨":{"全部":[""],"A区":["全部","一栋","二栋","三栋","四栋"],"B区":["全部","五栋","六栋","七栋","八栋"]}},
    //全部区域
    allRegion2: {},
    //全部楼号
    allRegion3: [],
    //校区
    region1: "",
    //区域
    region2: "",
    //楼号
    region3: "",
    //全部日期
    allTime1: ["全部", "今天", "明天", "后天"],
    //全部时间
    allTime2: [],
    //日期
    time1: "",
    //筛选宿舍
    selectRegion: "",
    //筛选时间
    selectTime: 0,

    //显示悬浮按钮
    float_show: false,

    //悬浮按钮位置
    x: 0,
    y: 0,
    x_1: 0,
    y_1: 0,
    x_2: 0,
    y_2: 0,
    x_3: 0,
    y_3: 0,

    //窗口宽高
    windowHeight: 0,
    windowWidth: 0,
  },

  //页面加载时读取数据库
  onLoad: function (options) {


    this.setData({
      currentIndex: options.tab_id,
      nowDate: Number(new Date().getTime()),
      float_show: false,
      windowHeight: wx.getSystemInfoSync().windowHeight,
      windowWidth: wx.getSystemInfoSync().windowWidth,
    })
    if (options.category_id != "") {
      this.setData({
        currentData: options.category_id
      })
    }
    this.setData({
      x: this.data.windowWidth - 60 - 15,
      y: this.data.windowHeight - 60-30,
    })
    this.navbarTab();
    // 添加到全局变量 (时间戳)
    app.globalData.nowDate = this.data.nowDate;

    //初始化子悬浮按钮位置
    this.subButton();
  },

  //点击更新主导航栏下标
  navbarTab: function (e) {
    if (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index,
        currentData: 0,
        float_show: false,
      });
    }

    //初始化子悬浮按钮位置
    this.subButton();

    console.log(this.data.currentIndex)
    var that = this;
    if (that.data.currentIndex == 0) {
      that.setData({
        feed: [],
        nextPage: 0,
        categories: ["全部", "化妆类", "电器类", "学习类", "衣物类", "生活类"],
        database: 'post',
        currentData: this.data.currentData,
      })
    } else if (that.data.currentIndex == 1) {
      that.setData({
        feed: [],
        accFeed: [],
        count: 0,
        nextPage: 0,
        categories: ["酬金高低", "宿舍筛选", "时间筛选"],
        database: 'express',
        currentData: 3,
      })
    } else if (that.data.currentIndex == 2) {
      if (that.data.currentData == 0) {
        that.setData({
          feed: [],
          accFeed: [],
          count: 0,
          nextPage: 0,
          categories: ["求助", "寻物", "找队友"],
          database: "recourse",
          currentData: this.data.currentData,
        })
      }else {
        that.setData({
          feed: [],
          accFeed: [],
          count: 0,
          nextPage: 0,
          categories: ["求助", "寻物", "找队友"],
          database: "discover",
          currentData: this.data.currentData,
        })
      }
    };
    this.allLoad();
  },

  //滑动更新主导航栏下标
  categoriesTab: function (e) {
    this.setData({
      // currentIndex: e.currentTarget.dataset.index
      currentData: e.currentTarget.dataset.index,
      float_show: false,
    })
    console.log(this.data.currentData)

    // 判断如果为寻物和找队友则更改搜索的数据库
    if (this.data.currentIndex == "2") {
      // 根据所选tab更改查找的数据库
      this.discoverType()
    }
  },

  //更新副导航栏下标
  categoriesChange: function (e) {
    let current = e.detail.current;
    let source = e.detail.source
    //console.log(source);
    // 这里的source是判断是否是手指触摸 触发的事件
    if (source === 'touch') {
      this.setData({
        currentData: current,
        float_show: false,
      })
      console.log(this.data.currentData)
      // 判断如果为寻物和找队友则更改搜索的数据库
      if (this.data.currentIndex == "2") {
        // 根据所选tab更改查找的数据库
        this.discoverType()
      }
    }
  },


  // 判断发现 的分类(求助 寻物 找队友)
  discoverType: function () {
    this.setData({
      feed: [],
      nextPage: 0,
    })
    if (this.data.currentData == 0) {
      this.setData({
        accFeed: [],
        count: 0,
        nextPage1: 0,
        database: "recourse",
      })
      this.allLoad();
    } else if (this.data.currentData == 1) {
      util.discoverLoad("寻物", this);
    }
    else {
      util.discoverLoad("找队友", this);
    }
  },

  
  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.allLoad();}, 1000);
    that.allLoad();
    console.log("lower")
  },

  // 调用util.js中读取数据库函数
  allLoad: function () {
    var that = this;
    if (that.data.currentIndex == 1 || (that.data.currentIndex == 2 && that.data.currentData == 0)){
      util.expressLoad(that);
    } else if (that.data.currentIndex == 0){
      util.allLoad(that);
      // util.expressLoad(that);
    } else if (that.data.currentIndex == 2 && that.data.currentData == 1){
      util.discoverLoad("寻物", this);
    } else if (that.data.currentIndex == 2 && that.data.currentData == 2) {
      util.discoverLoad("找队友", this);
    }
  },

  //跳转到点击页面
  jumpToPost: function (e) {
    var id = e.currentTarget.id
    console.log(e.currentTarget.id)
    console.log(this.data.feed[id])

    var post_data = JSON.stringify(this.data.feed[id])

    if(this.data.feed[id].type=="求助"){
      wx.navigateTo({
        // url: '../posttest/posttest?post_data=' + post_data
        url: '../contact_recourse/contact_recourse?post_data=' + post_data
      })
    }else{
      wx.navigateTo({
        // url: '../posttest/posttest?post_data=' + post_data
        url: '../contact/contact?post_data=' + post_data
      })
    }
  },



  //快递跳转到点击页面
  jumpToExpress: function(e) {
    var id = e.currentTarget.id
    var express_data = JSON.stringify(this.data.feed[id])
    wx.navigateTo({
      url: '../contact_express/contact_express?express_data=' + express_data
    })
  },

  //更新下拉菜单下标
  menusTap: function(e) {
    if (this.data.currentData == e.currentTarget.dataset.index) {
      this.setData({
        currentData: 3
      })
    }else {
      this.setData({
        currentData: e.currentTarget.dataset.index
      })
    }
    this.setData({
      //全部区域
      allRegion2: {},
      //全部楼号
      allRegion3: [],
      //校区
      region1: "",
      //区域
      region2: "",
      //楼号
      region3: "",
      //全部时间
      allTime2: [],
      //日期
      time1: "",
      float_show: false,
    })
  },

  //根据酬金筛选
  selectByPrice: function(e){
    this.allLoad();
    if (e.target.dataset.price == '全部') {
      this.data.categories[0]="酬金高低"
    } else {
      this.data.categories[0]=e.target.dataset.price.substring(2,6);
      if (this.data.categories[0] == '由低到高'){
        this.data.feed.sort((a, b) => parseInt(a.price) - parseInt(b.price))
        this.data.accFeed.sort((a, b) => parseInt(a.price) - parseInt(b.price))
      }else {
        this.data.feed.sort((b, a) => parseInt(a.price) - parseInt(b.price))
        this.data.accFeed.sort((b, a) => parseInt(a.price) - parseInt(b.price))
      }
    }
    this.setData({
      feed: this.data.feed,
      accFeed: this.data.accFeed,
      categories: this.data.categories,
      currentData: 3
    })
  },

  //选择宿舍
  selectByRegion1: function(e){
    this.setData({
      allRegion2:this.data.allRegion1[e.currentTarget.dataset.region1],
      allRegion3:{},
      region1: e.target.dataset.region1,
      region2:'',
    });
    if (e.target.dataset.region1 == '全部'){
      this.allLoad();
      this.data.categories[1]="宿舍筛选"
      this.setData({
        selectRegion: "",
        categories: this.data.categories,
        currentData: 3,
      })
    }
  },
  selectByRegion2: function(e){
    this.setData({
      allRegion3:this.data.allRegion2[e.currentTarget.dataset.region2],
      region2: e.target.dataset.region2,
    });
    if (e.target.dataset.region2 == '全部'){
      this.allLoad();
      this.data.categories[1]=this.data.region1
      this.setData({
        selectRegion: "",
        categories: this.data.categories,
        currentData: 3,
      })
    }
  },
  selectByRegion3: function(e){
    this.allLoad();
    if (e.target.dataset.region3 == '全部'){
      this.data.categories[1]=this.data.region1 + this.data.region2
    }else {
      this.data.categories[1]=this.data.region1 + e.target.dataset.region3
    }
    this.setData({
      selectRegion: this.data.categories[1].substring(2,4),
      categories: this.data.categories,
      currentData: 3,
    })
  },

  //选择时间
  selectByTime1: function(e){  
    if (e.target.dataset.time1 == '全部') {
      this.allLoad();
      this.data.categories[2]="时间筛选"
      this.setData({
        categories: this.data.categories,
        selectTime: 0,
        allTime2: [],
        time1: e.target.dataset.time1,
        currentData: 3
      })      
    }else {
      this.setData({
        allTime2:["全部", "09:00前","10:00前","11:00前","12:00前","13:00前","14:00前","15:00前","16:00前","17:00前","18:00前","19:00前","20:00前","21:00前"],
        time1: e.target.dataset.time1
      })
    }
  },
  selectByTime2: function(e){
    this.allLoad();
    if (e.target.dataset.time2 == '全部'){
      if (this.data.time1 == '今天') {
        this.data.selectTime = Number(new Date((util.getDate(new Date()))).getTime()) + 1 * 86400000
      } else if (this.data.time1 == '明天') {
        this.data.selectTime = Number(new Date((util.getDate(new Date()))).getTime()) + 2 * 86400000
      } else if (this.data.time1 == '后天') {
        this.data.selectTime = Number(new Date((util.getDate(new Date()))).getTime()) + 3 * 86400000
      }
      this.data.categories[2]=this.data.time1
    }else {
      if (this.data.time1 == '今天') {
        this.data.selectTime = Number(new Date((util.getDate(new Date()))).getTime())
      } else if (this.data.time1 == '明天') {
        this.data.selectTime = Number(new Date((util.getDate(new Date()))).getTime()) + 1 * 86400000
      } else if (this.data.time1 == '后天') {
        this.data.selectTime = Number(new Date((util.getDate(new Date()))).getTime()) + 2 * 86400000
      }
      this.data.categories[2]=this.data.time1 + e.target.dataset.time2.substring(0,5)
      this.data.selectTime=this.data.selectTime+parseInt(e.target.dataset.time2.substring(0,2))*3600000
    }
    this.setData({
      selectTime: this.data.selectTime,
      categories: this.data.categories,
      currentData: 3
    })
  },

  //关闭快递选项显示
  select_close: function () {
    this.setData({
      currentData: 3,
    })
  },

  // 悬浮按钮
  floatShow: function () {
    this.setData({
      float_show: !this.data.float_show
    })
  },

  // 发布信息
  postItem: function () {
    if (this.data.currentIndex == 0) {
      wx.navigateTo({
        url: "../../Post/uploadGoods/uploadGoods"
      })
    } else if (this.data.currentIndex == 1) {
      wx.navigateTo({
        url: "../../Post/uploadExpress/uploadExpress"
      })
    } else if (this.data.currentIndex == 2) {
      wx.navigateTo({
        url: "../../Post/uploadDiscover/uploadDiscover"
      })
    }
    this.setData({
      float_show: false
    })
  },

  //刷新信息
  refreshItem: function () {
    this.navbarTab();
    this.setData({
      float_show: false
    })
  },

  //搜索信息
  searchItem: function () {
    wx.navigateTo({
      url: "../search/search"
    })
    this.setData({
      float_show: false
    })
  },

  //悬浮按钮移动
  buttonMove: function (e) {
    this.setData({
      x: e.detail.x,
      y: e.detail.y,
    })

    //调节子悬浮按钮位置
    this.subButton();

  },

  //子悬浮按钮位置
  subButton: function () {
    if (this.data.x > (this.data.windowWidth - 60) / 2) {
      if (this.data.y < (this.data.windowHeight - 60) / 2) {
        if (this.data.currentIndex == 0) {
          this.setData({
            x_1: this.data.x,
            y_1: this.data.y + 100,
            x_2: this.data.x - 70,
            y_2: this.data.y + 70,
            x_3: this.data.x - 100,
            y_3: this.data.y,
          })
        } else {
          this.setData({
            x_2: this.data.x - 30,
            y_2: this.data.y + 90,
            x_3: this.data.x - 90,
            y_3: this.data.y + 30,
          })
        }
      } else {
        if (this.data.currentIndex == 0) {
          this.setData({
            x_1: this.data.x,
            y_1: this.data.y - 100,
            x_2: this.data.x - 70,
            y_2: this.data.y - 70,
            x_3: this.data.x - 100,
            y_3: this.data.y,
          })
        } else {
          this.setData({
            x_2: this.data.x - 30,
            y_2: this.data.y - 90,
            x_3: this.data.x - 90,
            y_3: this.data.y - 30,
          })
        }
      }
    }else {
      if (this.data.y < (this.data.windowHeight - 60) / 2) {
        if (this.data.currentIndex == 0) {
          this.setData({
            x_1: this.data.x,
            y_1: this.data.y + 100,
            x_2: this.data.x + 70,
            y_2: this.data.y + 70,
            x_3: this.data.x + 100,
            y_3: this.data.y,
          })
        } else {
          this.setData({
            x_2: this.data.x + 30,
            y_2: this.data.y + 90,
            x_3: this.data.x + 90,
            y_3: this.data.y + 30,
          })
        }
      } else {
        if (this.data.currentIndex == 0) {
          this.setData({
            x_1: this.data.x,
            y_1: this.data.y - 100,
            x_2: this.data.x + 70,
            y_2: this.data.y - 70,
            x_3: this.data.x + 100,
            y_3: this.data.y,
          })
        } else {
          this.setData({
            x_2: this.data.x + 30,
            y_2: this.data.y - 90,
            x_3: this.data.x + 90,
            y_3: this.data.y - 30,
          })
        }
      }
    }
  },

})