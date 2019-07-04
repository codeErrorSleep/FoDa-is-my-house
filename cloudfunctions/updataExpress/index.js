// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数


exports.main = async (event, context) => {
  var receiver_openid=event.receiver_openid
  var express_id=event.express_id
  try {
    return await db.collection('express').doc(express_id).update({
      data: {
        receiver_openid:receiver_openid
      }
    })
  } catch (e) {
    console.log(e)
  }
}