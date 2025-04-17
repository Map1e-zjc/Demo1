<template>
	<view>
		<button @click="createAccount()" class="btn">创建账号</button>
		<button @click="checkRegister()" class="btn">账号查重</button>
		<button @click="setUserStorage()" class="btn">身份缓存</button>
		<button @click="removeUserStorage()" class="btn">移除缓存</button>
		<button @click="uploadImage" class="btn">上传照片</button>
	</view>
</template>

<script>
export default 
{
	data() {
		return {
			isRegistering:false,
			isRegistered:false,
			account:"zhoujiacheng",
			password:"123456",
			image: null,
		}
	},
	methods:{
		async checkRegister(){
			try {
				const res = await uniCloud.callFunction({
					name: 'db-query',
					data: {
						collectionName: 'User_data',
						query:
						{
							account:this.account,
							password:this.password,
						}
					}
				})
				if(res.result.code == 200)
				{
					this.isRegistered = true;
					uni.showToast({
						title: '已有同名账号！',
						icon: 'error'
					});
				}
			}
			catch(err)
			{
				uni.showToast({
					title: '函数调用失败',
					icon: 'error'
				});
			}
		},
		async createAccount()
		{
			if(this.isRegistering)
			{
				uni.showToast({
					title: '正在注册中，请稍候',
					icon: 'none'
				});
				return;
			}
			if(this.isRegistered)
			{
				uni.showToast({
					title: '同名账号已注册',
					icon: 'none'
				});
				return;
			}
			this.isRegistering = true;
			try {
				const res = await uniCloud.callFunction({
					name: 'db-add',
					data: {
						collectionName: 'User_data',
						data:
						{
							account:this.password,
							password:this.password,
						}
					}
				});
				if(res.result.code == 200)	
				{
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					});
				}
				else if(res.result.code == 500)
				{
					uni.showToast({
						title: '同名账号已注册',
						icon: 'error'
					});
				}
				console.log('用户数据:', res.result);
			} catch (err) {
				console.error('注册失败:', err);
				uni.showToast({
					title: '注册失败，请重试',
					icon: 'none'
				});
			} finally 
			{
				this.isRegistering = false;
			}
		},
		setUserStorage()
		{
			const test = uni.getStorageSync('User_data');
			console.log("读取到的缓存如下：");
			console.log(test);
			const user = {};
			user.account = this.account;
			user.password = this.password;
			uni.setStorageSync('User_data',user);
			const ans = uni.getStorageSync('User_data');
			console.log("缓存已设置内容如下：");
			console.log(ans);
		},
		removeUserStorage()
		{
			const test = uni.getStorageSync('User_data');
			console.log(test);
			uni.removeStorageSync('User_data');
			console.log("上面的缓存已删除");
		},
		async uploadImage() {
			// 调用系统媒体选择器
			uni.chooseMedia({
				count: 1, // 最多可以选择的文件数量
				mediaType: ['image'], // 文件类型，只选择图片
				sourceType: ['album', 'camera'], // 图片和视频选择的来源
				camera: 'back', // 使用后置摄像头
				success: async (res) => {
					try {
						uni.showLoading({
							title: '上传中...'
						});
						
						// 获取临时文件路径
						const tempFilePath = res.tempFiles[0].tempFilePath;
						// 读取图片内容为base64
						const fileContent = await this.fileToBase64(tempFilePath);
						
						// 生成随机文件名
						const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
						
						// 调用云函数上传图片
						const uploadResult = await uniCloud.callFunction({
							name: 'uploadImage',
							data: {
								fileContent,
								fileName
							}
						});
						
						if (uploadResult.result.code === 200) {
							uni.showToast({
								title: '上传成功',
								icon: 'success'
							});
							console.log('图片上传成功，图片地址:', uploadResult.result.data.url);
							this.image = uploadResult.result.data.url;
						} else {
							throw new Error(uploadResult.result.message || '上传失败');
						}
					} catch (err) {
						console.error('上传图片失败:', err);
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						});
					} finally {
						uni.hideLoading();
					}
				}
			});
		},
		
		// 将文件转为base64
		fileToBase64(filePath) {
			return new Promise((resolve, reject) => {
				// 使用uni-app统一API读取文件内容
				uni.getFileSystemManager().readFile({
					filePath: filePath,
					encoding: 'base64',
					success: (res) => {
						resolve(res.data);
					},
					fail: (err) => {
						console.error('读取文件失败:', err);
						// 尝试使用其他方式读取文件（如微信小程序API）
						// #ifdef MP-WEIXIN
						wx.getFileSystemManager().readFile({
							filePath: filePath,
							encoding: 'base64',
							success: (res) => {
								resolve(res.data);
							},
							fail: (error) => {
								reject(error);
							}
						});
						// #endif
						
						// 如果都失败了，返回原始错误
						reject(err);
					}
				});
			});
		}
	}
}	
</script>

<style>
.btn {
	margin: 10px;
}
</style>
