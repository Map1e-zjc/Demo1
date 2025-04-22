'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
  const { account, password } = event
  
  // 参数校验
  if (!account || !password) {
    return {
      code: 400,
      message: '账号密码不能为空'
    }
  }

  // 执行登录
  const res = await uniID.login({
    username: account,
    password: password
  })

  return res
}