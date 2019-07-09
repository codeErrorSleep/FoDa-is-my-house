Page({
  data: {
    toView: 'yellow',
    scrollLeft: 0,
    windowHeight:0,
    //滚动的数组
    scrolls: [
      {
        name: '黄色',
        tag: 'yellow', 
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
      {
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
    ],
  
  },

  onShow:function(res){
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.windowHeight)
      this.setData({
        windowHeight:res.windowHeight
      })
    } catch (e) {
      // Do something when catch error
    }
  },

  scrollToRed:function(e)
  {
    this.setData({
      toView: 'green'
    })
  },
  scrollTo100: function (e) {
    this.setData({
      scrollLeft: 100+this.data.scrollLeft
    })
  },
  
  upper: function (e) {
    console.log('滚动到顶部')
  },
  lower: function (e) {
    console.log('滚动到底部')
  },
  scroll: function (e) {
    console.log(e)
  },
})