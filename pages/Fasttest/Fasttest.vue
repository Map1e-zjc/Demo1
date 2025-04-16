<template>
	<view>
		<button @click="createAccount()" class="btn">创建账号</button>
		<button @click="checkRegister()" class="btn">账号查重</button>
		<button @click="setUserStorage()" class="btn">身份缓存</button>
		<button @click="removeUserStorage()" class="btn">移除缓存</button>
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
	}
}	
</script>

<style>

</style>
