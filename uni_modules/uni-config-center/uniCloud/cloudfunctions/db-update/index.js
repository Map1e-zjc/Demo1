'use strict';
exports.main = async (event, context) => {
  const { collectionName, docId, data } = event
  
  if (!collectionName || !docId || !data) {
    return {
      code: 400,
      message: '缺少必要参数: collectionName、docId或data'
    }
  }
  
  const db = uniCloud.database()
  const collection = db.collection(collectionName)
  
  try {
    const res = await collection.doc(docId).update(data)
    return {
      code: 200,
      message: '更新成功',
      data: res
    }
  } catch (e) {
    return {
      code: 500,
      message: '更新失败',
      error: e.message
    }
  }
}