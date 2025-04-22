<template>
  <view class="login-container">
    <view class="logo"></view>
    <text class="title">瓯域产业云招商</text>

    <form class="login-form" @submit="handleLogin">
      <view class="input-item">
        <input v-model="form.account" placeholder="请输入账号" class="custom-input" placeholder-class="placeholder-style" />
      </view>

      <view class="input-item">
        <input v-model="form.password" type="password" placeholder="请输入密码" class="custom-input"
          placeholder-class="placeholder-style" />
      </view>

      <button form-type="submit" class="login-btn" :disabled="!form.account || !form.password">
        管理员登录
      </button>
    </form>
  </view>
</template>

<script>
export default {

  data() {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  onShow() {
  	const user = uni.getStorageSync('User_data')
  	console.log(user);
  	if(user!='')
  	{
  		uni.showModal({
  		   title: '检测到登陆记录', // 标题
  		   content: '直接进入管理员页面？', // 内容
  		   success: function (res) {
  		     if (res.confirm) {
  		       uni.navigateTo({
  		       	url:"/pages/Admin/Admin"
  		       })
  		     } else if (res.cancel) {
  		       
  		     }
  		   }
  		});
  	}
  },
  methods: {
    async handleLogin() {
      try {
        const res = await uniCloud.callFunction({
          name: 'db-query',
          data: {
            collectionName: 'User_data',
            query: {
              account: this.form.account,
              password: this.form.password,
            }
          }
        })
        if (res.result.code == 200) {
          uni.showToast({
            title: '登录成功，已获得管理员权限',
            icon: 'none'
          });
          const user = {};
          user.account = this.form.account,
          user.password = this.form.password,
		  uni.setStorageSync('User_data', user);
		  uni.navigateTo({
		  	url:"/pages/Admin/Admin"
		  })
        }
      } catch (err) {
        console.log(err)
      }
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

.login-btn,
.exit-btn {
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
  color: rgba(255, 255, 255, 0.9);
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