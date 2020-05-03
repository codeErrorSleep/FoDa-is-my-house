// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'sendRegisteredMessage': {
      return sendRegisteredMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'sendExpressTemplate': {
      return sendExpressTemplate(event)
    }
    case 'sendRecourseTemplate':{
      return sendRecourseTemplate(event)
    }
    default: {
      return
    }
  }
}

// 快递发送接单消息
async function sendExpressTemplate(event) {
  // const { OPENID } = cloud.getWXContext()
  // 模板id
  var templateId ="l3MDM8SSqxszV1FJ-TY-LxJTKo5m0Djf--ZVXrWLbzA"


  // 根据验证是否通过来发送信息
  var orders=event.orders
  if(orders=="代收成功"){
    note="你的快递也被接单,请等待代收人联系联系"
  }
  else{
    orders="代收失败"
    note="快递暂无人接单,请你拿回快递或提高酬金"
  }
  // var wechat_id=event.wechat_id
  // var phone=event.phone
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: event.user_openid,
    template_id: templateId,
    data: {
      phrase3: {
        value: orders,
      },
      thing8: {
        value: note,
      },
    },
  })
  return sendResult
}

// 发送求助成功的模板信息
async function sendRecourseTemplate(event) {
  // const { OPENID } = cloud.getWXContext()
  // 模板id
  var templateId ="ILE1bwSQDi7ctxacKh7yYhgBuh7esx6xfr68OKOhTCs"


  // 根据验证是否通过来发送信息
  var orders=event.orders
  if(orders=="求助成功"){
    note="已有人愿意提供帮助,可主动联系帮助者"
  }
  else{
    orders="求助失败"
    note="暂时未有帮助,请再次发出求助或提高酬金"
  }
  var wechat_id=event.wechat_id
  var phone=event.phone
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: event.user_openid,
    template_id: templateId,
    data: {
      thing1: {
        value: orders,
      },
      thing3: {
        value: note,
      },
    },
    emphasisKeyword: 'thing1.DATA'
  })
  return sendResult

}


// 修改为订阅消息
// 发送验证成功的模板信息
async function sendRegisteredMessage(event) {
  // const { OPENID } = cloud.getWXContext()
  // 模板id
  var templateId ="5PHcG60eH76swsvB351m8G6SENp1IKQceZqivYQkUA4"


  // 根据验证是否通过来发送信息
  var approve=event.approve
  if(approve =="认证成功"){
    note="恭喜你已成为佛大叮当的一员"
  }
  else{
    approve="认证不成功"
    note="请重新上传校园卡进行验证"
  }

  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: event.user_openid,
    template_id: templateId,
    data: {
      thing1: {
        value: approve,
      },
      thing5: {
        value: note,
      },
    },
    // miniprogramState: 'developer'

  })
  return sendResult
}





async function getWXACode(event) {

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}
