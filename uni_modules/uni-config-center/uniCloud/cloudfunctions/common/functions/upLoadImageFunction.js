// 通用云函数操作模块
export default {
  /**
   * 图片上传功能
   * @returns {Promise<string>} 返回图片URL
   */
  async uploadImageFunction() {
    try {
      const res = await this._chooseImage();
      const fileContent = await this.fileToBase64(res.tempFiles[0].tempFilePath);
      return await this._uploadToCloud(fileContent);
    } catch (err) {
      console.error('上传流程错误:', err);
      throw err;
    }
  },

  // 私有方法：选择图片
  _chooseImage() {
    return new Promise((resolve, reject) => {
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success: resolve,
        fail: reject
      });
    });
  },

  // 私有方法：上传到云存储
  async _uploadToCloud(fileContent) {
	let fileName = uni.getStorageSync('Temp_filename')
	if(fileName == '')
	{
		 fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
		 uni.setStorageSync('Temp_filename', fileName);
	}
    const uploadResult = await uniCloud.callFunction({
      name: 'uploadImage',
      data: { fileContent, fileName }
    });

    if (uploadResult.result.code === 200) {
      return uploadResult.result.data.url;
    }
    throw new Error(uploadResult.result.message || '上传失败');
  },

  // 文件转Base64（保留平台兼容）
  fileToBase64(filePath) {
    return new Promise((resolve, reject) => {
      const fs = uni.getFileSystemManager();
      
      fs.readFile({
        filePath,
        encoding: 'base64',
        success: (res) => resolve(res.data),
        fail: async (err) => {
          try {
            // 微信小程序特殊处理
            if (uni.getSystemInfoSync().platform === 'mp-weixin') {
              const wxRes = await wx.getFileSystemManager().readFile({
                filePath,
                encoding: 'base64'
              });
              return resolve(wxRes.data);
            }
            reject(err);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }
}