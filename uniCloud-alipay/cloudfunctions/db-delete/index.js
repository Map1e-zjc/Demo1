'use strict';
exports.main = async (event, context) => {
  const { collectionName, docId } = event
  
  if (!collectionName || !docId) {
    return {
      code: 400,
      message: '缺少必要参数: collectionName或docId'
    }
  }
  
  const db = uniCloud.database()
  const collection = db.collection(collectionName)
  
  try {
    const res = await collection.doc(docId).remove()
    return {
      code: 200,
      message: '删除成功',
      data: res
    }
  } catch (e) {
    return {
      code: 500,
      message: '删除失败',
      error: e.message
    }
  }
}