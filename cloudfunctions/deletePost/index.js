// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数


exports.main = async (event, context) => {
  var database=event.database
  var post_id=event.post_id
  console.log(database)

  console.log(post_id)
  try {
    return await db.collection(event.database).doc(event.post_id).remove({
      success: console.log,
      fail: console.error
    })
  } catch (e) {
    console.log(e)
  }
}