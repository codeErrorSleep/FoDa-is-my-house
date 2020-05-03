// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数


exports.main = async (event, context) => {
  var user_id=event.user_id
  var approve=event.approve
  var al_approve=event.al_approve

  try {
    return await db.collection('users').doc(user_id).update({
      data: {
        approve: approve,
        al_approve: al_approve
      }
    })
  } catch (e) {
    console.log(e)
  }
}