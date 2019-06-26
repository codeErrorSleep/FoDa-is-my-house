// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#E74552",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "icon/home.png",
            "selectedIconPath": "icon/home_selected.png",
            "text": "我要买"
          },
          {
            "pagePath": "/pages/sell/sell",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": "我要卖"
          },
          {
            "pagePath": "/pages/mine/mine",
            "iconPath": "icon/mine.png",
            "selectedIconPath": "icon/mine_selected.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data:{
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
