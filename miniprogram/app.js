App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/1.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/2.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/3.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/4.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/5.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/6.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'cloud://fdimh-eqlws.6664-fdimh-eqlws/head_imgs/7.jpg'
    }],
  }
})