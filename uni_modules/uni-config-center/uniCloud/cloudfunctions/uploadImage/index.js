// 云函数 uploadImage
exports.main = async (event) => {
  const { fileContent, fileName, folderPath = 'images/' } = event;
  
  // 校验必填参数
  if (!fileContent || !fileName) {
    return { code: 400, message: '缺少文件内容或文件名' };
  }

  try {
    const result = await uniCloud.uploadFile({
      fileContent: Buffer.from(fileContent, 'base64'),
      cloudPath: `${folderPath}${fileName}`
    });
    
    return { 
      code: 200, 
      data: {
        url: result.fileID // 微信小程序中建议返回fileID
      }
    };
  } catch (e) {
    return { code: 500, message: e.message };
  }
};