<template>
	<view>
		<button @click="createAccount" class="btn">创建账号</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isRegistering:false,
			}
		},
		methods: 
		{
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
