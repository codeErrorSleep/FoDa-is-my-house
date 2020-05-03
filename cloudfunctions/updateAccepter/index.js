// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数


// 写入接单者的openid(快递和求助)
exports.main = async (event, context) => {
  // var receiver_wechat_id=event.receiver_wechat_id
  // var receiver_phone=event.receiver_phone
  // var express_id=event.express_id


  try {
    return await db.collection(event.database).doc(event._id).update({
      data: {
        accepter_openid: event.user_openid,
      }
    })
  } catch (e) {
    console.log(e)
  }
}