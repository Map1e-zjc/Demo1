'use strict';
exports.main = async (event, context) => {
  const { collectionName, query = {}, options = {} } = event
  
  if (!collectionName) {
    return {
      code: 400,
      message: '缺少必要参数: collectionName'
    }
  }
  
  const db = uniCloud.database()
  const collection = db.collection(collectionName)
  
  // 构建查询条件
  let queryBuilder = collection.where(query)
  
  // 处理排序
  if (options.orderBy && options.orderDirection) {
    queryBuilder = queryBuilder.orderBy(options.orderBy, options.orderDirection)
  }
  
  // 处理分页
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit)
  }
  if (options.skip) {
    queryBuilder = queryBuilder.skip(options.skip)
  }
  
  // 处理字段筛选
  if (options.field) {
    queryBuilder = queryBuilder.field(options.field)
  }
  
  try {
    const res = await queryBuilder.get()
    return {
      code: 200,
      message: '查询成功',
      data: res
    }
  } catch (e) {
    return {
      code: 500,
      message: '查询失败',
      error: e.message
    }
  }
}