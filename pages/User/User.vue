<template>
	<view class="container">
		<view class="top">
			<view class="avatar-box">
				<image src="/static/other_icons/管理员.png" class="icon" mode="aspectFit"></image>
			</view>
			<view class="login-text">管理员</view>
		</view>
		
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
		}
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