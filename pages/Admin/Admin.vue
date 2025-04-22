<template>
	<view class="container">
		<view class="title">
			管理员页面
		</view>
		<view class="menu-list">
			<view class="menu-item" @click="ToInsertPorject()">
				<view class="menu-left">
					<image src="/static/other_icons/edit.png" class="menu-icon"></image>
					<text class="menu-text">新增项目</text>
				</view>
				<image src="/static/other_icons/arrow.png" class="arrow"></image>
			</view>
			<view class="menu-item" @click="exitManager()">
				<view class="menu-left">
					<image src="/static/other_icons/about.png" class="menu-icon"></image>
					<text class="menu-text">退出管理员页面并删除登录记录</text>
				</view>
				<image src="/static/other_icons/arrow.png" class="arrow"></image>
			</view>
			<view class="menu-item"  @click="exitAdmin()">
				<view class="menu-left">
					<image src="/static/other_icons/about.png" class="menu-icon"></image>
					<text class="menu-text">退出管理员页面但保留登录记录</text>
				</view>
				<image src="/static/other_icons/arrow.png" class="arrow"></image>
			</view>
			<view class="menu-item"  @click="toFasttest()">
				<view class="menu-left">
					<image src="/static/other_icons/about.png" class="menu-icon"></image>
					<text class="menu-text">测试函数页</text>
				</view>
				<image src="/static/other_icons/arrow.png" class="arrow"></image>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
		}
	},
	onShow() {
		const user = uni.getStorageSync('User_data')
		//console.log(user + user!='');
	},
	methods: {
		ToManagePorject()
		{
			uni.navigateTo({
				url:"/pages/Admin/ManageProject"
			})
		},
		ToInsertPorject()
		{
			uni.navigateTo({
				url:"/pages/Admin/InsertProject"
			})
		},
		toFasttest()
		{
			uni.navigateTo({
				url:"/pages/Fasttest/Fasttest"
			})
		},
		exitManager() {
		  uni.showToast({
		    title: '退出成功，已恢复游客身份',
		    icon: 'none'
		  });
		  uni.removeStorageSync('User_data');
		  setTimeout(() => {
			uni.switchTab({
			url:"/pages/AboutUs/AboutUs"
			})
		  }, 1000);
		},
		exitAdmin() {
		  uni.showToast({
		    title: '退出成功，保留管理员权限',
		    icon: 'none'
		  });
		  setTimeout(() => {
			uni.switchTab({
			url:"/pages/AboutUs/AboutUs"
			})
		  }, 1000);
		},
	},
}
</script>

<style scoped>
.container {
	padding: 0;
	background-color: #f5f5f5;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	text-align: center;
	padding: 30rpx 0;
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