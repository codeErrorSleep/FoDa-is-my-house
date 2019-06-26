//app.js
App({
  onLaunch: function () {
    wx.hideTabBar();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },
  //自定义tabbar组件
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }

    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    sessionId: null,
    userInfo: null,
    hasUserInfo: false,
    hasAuth: true,
    Loading: false, //是否加载
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#E74552",
      "list": [{
        "pagePath": "/pages/Index/index_main/index_main",
        "text": "主页",
        "iconPath": "icon/home.png",
        "selectedIconPath": "icon/home_selected.png"
      },
      {
        "pagePath": "/pages/Index/modal/modal",
        "iconPath": "icon/center.png",
        "isSpecial": true,
        "text": ""
      },
      {
        "pagePath": "/pages/Mine/mine_main/mine_main",
        "text": "我的",
        "iconPath": "icon/me.png",
        "selectedIconPath": "icon/me_selected.png"
      }
      ]
    }
  }
})
