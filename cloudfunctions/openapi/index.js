// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    default: {
      return
    }
  }
}

async function sendTemplateMessage(event) {
  // const { OPENID } = cloud.getWXContext()
  // 模板id
  const templateId ="BnaH1SWP6RP7kTUl8oIKGHE9IE_rgcewtNqaPmBC_v8"


  // 根据验证是否通过来发送信息
  var approve=event.approve
  if(approve){
    approve="认证成功"
    note="恭喜你已成为佛大叮当的一员"
  }
  else{
    approve="认证不成功"
    note="请重新上传图片进行验证"
  }


  const sendResult = await cloud.openapi.templateMessage.send({
    touser: event.user_openid,
    templateId,
    formId: event.formId,
    data: {
      keyword1: {
        value: approve,
      },
      keyword2: {
        value: '佛大在校学生',
      },
      keyword3: {
        value: note,
      },
    },
    emphasisKeyword: 'keyword1.DATA'

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
