'use strict';
exports.main = async (event, context) => {
  // event为客户端上传的参数
  const { collectionName, data } = event
  
  // 校验必填参数
  if (!collectionName || !data) {
    return {
      code: 400,
      message: '缺少必要参数: collectionName或data'
    }
  }
  
  const db = uniCloud.database()
  const collection = db.collection(collectionName)
  
  try {
    const res = await collection.add(data)
    return {
      code: 200,
      message: '新增成功',
      data: res
    }
  } catch (e) {
    return {
      code: 500,
      message: '新增失败',
      error: e.message
    }
  }
}