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
				<view class="info-content">
					<view class="label">招商热线</view>
					<view class="value">0577-88123456</view>
				</view>
			</view>
			
			<view class="info-item">
				<view class="icon-box">
					<image src="/static/other_icons/people.png" class="icon" mode="aspectFit"></image>
				</view>
				<view class="info-content">
					<view class="label">联系人</view>
					<view class="value">张经理</view>
				</view>
			</view>
			
			<view class="info-item">
				<view class="icon-box">
					<image src="/static/other_icons/email.png" class="icon" mode="aspectFit"></image>
				</view>
				<view class="info-content">
					<view class="label">电子邮箱</view>
					<view class="value">zhaoshang@ouyu.com</view>
				</view>
			</view>
			
			<view class="info-item">
				<view class="icon-box">
					<image src="/static/other_icons/address.png" class="icon" mode="aspectFit"></image>
				</view>
				<view class="info-content">
					<view class="label">公司地址</view>
					<view class="value">温州市瓯城区车站大道100号</view>
				</view>
			</view>
		</view>
		
		<view class="feedback-btn">
			意见反馈
		</view>
	</view>
</template>

<script setup>
	
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