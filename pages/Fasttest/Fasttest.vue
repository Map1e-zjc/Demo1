<template>
	<view>
		<button @click="createAccount" class="btn">创建账号</button>
		<button @click="checkRegister" class="btn">账号查重</button>
	</view>
</template>

<script>
export default 
{
	data() {
		return {
			isRegistering:false,
			isRegistered:false,
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
							account:"zhoujiacheng",
							password:"123456"
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
							account:"zhoujiacheng",
							password:"123456"
						}
					}
				});
				
				uni.showToast({
					title: '注册成功',
					icon: 'success'
				});
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
		}
	}
}	
</script>

<style>

</style>
