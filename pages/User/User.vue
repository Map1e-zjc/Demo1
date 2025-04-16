<template>
<view class="container">
		<view class="goto" @click="goSomewhere1">
			跳转1
		<view class="top">
			<view class="avatar-box">
				<image src="/static/other_icons/管理员.png" class="icon" mode="aspectFit"></image>
			</view>
			<view class="login-text">管理员</view>
</view>
		<view class="goto" @click="goSomewhere2">
			跳转2
		</view>
		<view class="about" @click="goAboutUs">
			关于我们
		
		<view class="menu-list">
			<navigator url="/pages/User/AboutUs">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/编辑.png" class="menu-icon"></image>
						<text class="menu-text">跳转1</text>
					</view>
					<image src="/static/other_icons/箭头.png" class="arrow"></image>
				</view>
			</navigator>
			
			<navigator url="/pages/User/AboutUs">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/标签.png" class="menu-icon"></image>
						<text class="menu-text">跳转2</text>
					</view>
					<image src="/static/other_icons/箭头.png" class="arrow"></image>
				</view>
			</navigator>
			
			<navigator url="/pages/User/AboutUs">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/关于我们.png" class="menu-icon"></image>
						<text class="menu-text">关于我们</text>
					</view>
					<image src="/static/other_icons/箭头.png" class="arrow"></image>
				</view>
			</navigator>
			
</view>
</view>
	
</template>

<script>
export default {
  data() {
    return {
		
	}
  },
  methods: {
	goSomewhere1() {
		uni.navigateTo({
			url: "/pages/User/AboutUs"
		})
	},
	goSomewhere2() {
		uni.navigateTo({
			url: "/pages/User/AboutUs"
		})
	},
	goAboutUs() {
		uni.navigateTo({
			url: "/pages/User/AboutUs"
		})
	export default {
		data() {
			return {

			}
		},
		methods: {
		}
	}
  }
}
</script>

<style scoped>
.container {
	padding: 0 20rpx;
}	
	
.goto {
	padding: 50rpx;
	text-align: center;
	font-size: 40rpx;
	border: 1px solid #e5e5e5 ;
	background-color: #eee;
	margin: 10rpx 0;
	padding: 0;
	background-color: #f5f5f5;
}
.about {
	padding: 50rpx;
	text-align: center;
	font-size: 40rpx;
	border: 1px solid #e5e5e5 ;

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
</style>