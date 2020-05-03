// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

cloud.init({
  env: 'fdimh-eqlws'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.command == "lte") {
      return await db.collection(event.database).where({
        [event.key]: _.lte(new Date(event.time))
      }).remove({
        success: function (res) {
          console.log("success")
        }, fail: function (err) {
          console.log("fail")
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}