<template>
	<view class="container">
		<view class="top">
			
			<view class="avatar-box" @click="goLogin">
				<image v-if="isLogin" src="/static/other_icons/admin.png" class="icon" mode="aspectFit"></image>
				<image v-else src="/static/other_icons/guest.png" class="icon" mode="aspectFit"></image>
			</view>
		
			
			<view class="login-text">{{isLogin == true ? "管理员": "游客"}}</view>
		</view>
		
		<view class="menu-list">
			<navigator url="/pages/User/AboutUs">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/edit.png" class="menu-icon"></image>
						<text class="menu-text">跳转1</text>
					</view>
					<image src="/static/other_icons/arrow.png" class="arrow"></image>
				</view>
			</navigator>
			
			<navigator url="/pages/User/Login">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/label.png" class="menu-icon"></image>
						<text class="menu-text">跳转2</text>
					</view>
					<image src="/static/other_icons/arrow.png" class="arrow"></image>
				</view>
			</navigator>
			
			<navigator url="/pages/User/AboutUs">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/about.png" class="menu-icon"></image>
						<text class="menu-text">关于我们</text>
					</view>
					<image src="/static/other_icons/arrow.png" class="arrow"></image>
				</view>
			</navigator>
			
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			isLogin:false,
		}
	},
	onShow() {
		this.getLoginInfo()
	},
	methods: {
		goLogin() {
			if(this.isLogin == true)
			{
				uni.showModal({
					title: '确认',
					  content: '确认取消管理员身份并进入重新输入信息吗',
					  success: (res) => {
					    if (res.confirm) {
					      uni.navigateTo({
					      	url:"/pages/User/Login"
					      })
					    } else if (res.cancel) {
					      return;
					    }
					  }
				})
			}
			else
			{
				uni.navigateTo({
					url:"/pages/User/Login"
				})
			}
		},
		getLoginInfo() {
		  const user = uni.getStorageSync('User_data');
		  if(user.account != undefined)
		  {
			this.isLogin = true;
			console.log(user)
		  }
		  console.log(this.isLogin)
		},
	},
}
</script>

<style scoped>
.container {
	padding: 0;
	background-color: #f5f5f5;
}

.top {
	height: 300rpx;
	width: 100%;
	background-color: #eee;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.avatar-box {
	width: 150rpx;
	height: 150rpx;
	background-color: #4080ff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.icon {
	width: 80rpx;
	height: 80rpx;
}

.login-text {
	color: #333;
	font-size: 32rpx;
}

.menu-list {
	background-color: #fff;
	margin-top: 20rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 20rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.menu-left {
	display: flex;
	align-items: center;
}

.menu-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}

.menu-text {
	font-size: 28rpx;
	color: #333;
}

.arrow {
	width: 30rpx;
	height: 30rpx;
	opacity: 0.5;
}
</style>