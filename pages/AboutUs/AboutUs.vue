<template>
	<view class="container">
		<view class="title">
			招商咨询
		</view>
		
		<view class="info-list">
			<view class="info-item">
				<view class="icon-box">
					<image src="/static/other_icons/call.png" class="icon" mode="aspectFit"></image>
				</view>
				<view class="info-content" @click="makePhoneCall('0577-58699829')">
					<view class="label">招商热线</view>
					<view class="value">0577-58699829</view>
				</view>
			</view>
			
			<view class="info-item">
				<view class="icon-box">
					<image src="/static/other_icons/people.png" @click="goToLogin()" class="icon" mode="aspectFit"></image>
				</view>
				<view class="info-content">
					<view class="label">联系人</view>
					<view class="value">潘女士</view>
				</view>
			</view>
		</view>
		
		<button @click="goToFeedBack()" class="feedback-btn">
			意见反馈
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			goToFeedBack() {
				uni.navigateTo({
					url: "/pages/AboutUs/FeedBack"
				});
			},
			goToLogin() {
				uni.navigateTo({
					url: "/pages/Admin/Login"
				});
			},
			makePhoneCall(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: phoneNumber
				});
			},
		}
	}
</script>

<style scoped>
.container {
	padding: 0 20rpx;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	text-align: center;
	padding: 30rpx 0;
}

.info-list {
	border-radius: 10rpx;
	overflow: hidden;
	background-color: #FFFFFF;
}

.info-item {
	display: flex;
	padding: 30rpx 20rpx;
	border-bottom: 1px solid #F5F5F5;
}

.icon-box {
	width: 80rpx;
	height: 80rpx;
	background-color: #F0F7FF;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.icon {
	width: 40rpx;
	height: 40rpx;
}

.info-content {
	flex: 1;
}

.info-item:first-child .info-content {
	position: relative;
}

.info-item:first-child .info-content::after {
	content: '';
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 36rpx;
	height: 36rpx;
	background-image: url('data:image/svg+xml;utf8,<svg t="1624531888945" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4688" width="36" height="36"><path d="M320 512l384-384 64 64L448 512l320 320-64 64-384-384z" p-id="4688" fill="%23007AFF"></path></svg>');
	background-repeat: no-repeat;
	background-size: cover;
	transform: translateY(-50%) rotate(180deg);
}

.label {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.value {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.feedback-btn {
	margin-top: 60rpx;
	background-color: #FFFFFF;
	text-align: center;
	padding: 30rpx 0;
	border-radius: 10rpx;
	font-size: 32rpx;
	color: #333;
	border: 1px solid #E5E5E5;
}
</style>