// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rq = require('request')
const baseUrl = 'https://smsdeveloper.zhenzikj.com'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router('send', async (ctx) => {
    ctx.body = new Promise(resolve => {
      rq({
        url: baseUrl + '/sms/send.html',
        method: "POST",
        json: true,
        form: {
          apiUrl: event.apiUrl,
          appId: event.appId,
          appSecret: event.appSecret,
          message: event.message,
          number: event.number,
          messageId: event.messageId,
        }
      }, function (error, response, body) {
        resolve({ body: body, error: error })
      });
      // setTimeout(() => {
      //   resolve('male');
      // }, 500);
    });
  });

  return app.serve();
}