<template>
  <view class="login-container">
    <view class="logo"></view>
    <text class="title">瓯域产业云招商</text>
    
    <form class="login-form" @submit="handleLogin">
      <view class="input-item">
        <input 
          v-model="form.account" 
          placeholder="请输入账号" 
          class="custom-input"
          placeholder-class="placeholder-style"
        />
      </view>
      
      <view class="input-item">
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          class="custom-input"
          placeholder-class="placeholder-style"
        />
      </view>

      <button 
		v-if="!isLogin"
        form-type="submit" 
        class="login-btn" 
        :disabled="!form.account || !form.password">
        管理员登录
      </button>
	  <button 
		@tap="exitManager"
		v-if="isLogin"
		class="exit-btn">
	    退出管理员模式
	  </button>
    </form>
  </view>
</template>

<script>
export default {
  const app = getApp()
  data() {
    return {
	  isLogin:false,
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
	onload()
	{
		
	},
	onpageshow()
	{
		if(app.globalData.isLogin == undefined) this.isLogin = false, app.globalData.isLogin = false;
		else this.isLogin = app.globalData.isLogin;
	},
	exitManager()
	{
		uni.showToast({
			title: '退出成功，已恢复游客身份',
			icon: 'none'
		});
		app.globalData.isLogin = false;
		this.isLogin = false;
	},
	async handleLogin()
	{
		try {
			const res = await uniCloud.callFunction({
				name: 'db-query',
				data: {
					collectionName:'User_data',
					query:{
					  account:this.form.account,
					  password:this.form.password,
					}
				}
			})
			if(res.result.code == 200)
			{
				uni.showToast({
					title: '登录成功，已获得管理员权限',
					icon: 'none'
				});
				this.isLogin = true;
				app.globalData.isLogin = true;
				const user = {};
				user.account = this.form.account,
				user.password = this.form.password,
				uni.setStorageSync('User_data',user);
			}
		} catch (err) 
		{
			console.log(this.isLogin)
			console.log(err)
		}
	},
    navigateToBack() {
      uni.navigateTo({
        url: '/pages/User/User'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 80rpx 40rpx;
  background: #fff;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  background: #2979FF;
  border-radius: 50%;
  margin-bottom: 40rpx;
}

.title {
  color: #303133;
  font-size: 36rpx;
  margin-bottom: 80rpx;
  font-weight: 500;
}

.login-form {
  width: 100%;
  max-width: 600rpx;
}

.input-item {
  margin-bottom: 40rpx;
  border-bottom: 2rpx solid #eee;
}

.custom-input {
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  padding: 20rpx 0;
}

.placeholder-style {
  color: #999;
}

.login-btn, .exit-btn{
  width: 100%;
  height: 88rpx;
  background: #2979FF;
  border-radius: 44rpx;
  color: white;
  font-size: 32rpx;
  margin-top: 60rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.internal-text {
  position: absolute;
  right: 40rpx;
  font-size: 24rpx;
  color: rgba(255,255,255,0.9);
}

.guest-link {
  color: #606266;
  font-size: 28rpx;
  margin-top: 60rpx;
}

/* 按钮禁用状态 */
button[disabled] {
  background: #a0cfff !important;
}
</style>