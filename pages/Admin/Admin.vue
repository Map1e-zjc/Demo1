<template>
	<view class="container">
		<view class="menu-list">
			<navigator url="/pages/Admin/InsertProject">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/edit.png" class="menu-icon"></image>
						<text class="menu-text">进入后台新增项目</text>
					</view>
					<image src="/static/other_icons/arrow.png" class="arrow"></image>
				</view>
			</navigator>
			
			<navigator url="/pages/Admin/ManageProject">
				<view class="menu-item">
					<view class="menu-left">
						<image src="/static/other_icons/label.png" class="menu-icon"></image>
						<text class="menu-text">管理项目表</text>
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
		}
	},
	onShow() {
		
	},
	methods: {
		exitManager() {
		  uni.showToast({
		    title: '退出成功，已恢复游客身份',
		    icon: 'none'
		  });
		},
	},
}
</script>

<style scoped>
.container {
	padding: 0;
	background-color: #f5f5f5;
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