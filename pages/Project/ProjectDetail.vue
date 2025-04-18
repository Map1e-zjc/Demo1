<template>
	<view class="detail-container">
		<!-- 项目基本信息 -->
		<view class="project-header">
			<image class="project-image" :src="projectData.image || '/static/image/test.png'" mode="aspectFill"></image>
			<view class="project-title">{{ projectData.name }}</view>
		</view>
		
		<!-- 基本信息卡片 -->
		<view class="info-card">
			<view class="card-title">基本信息</view>
			<view class="info-item">
				<text class="label">地址：</text>
				<text class="value">{{ projectData.district }} {{ projectData.address }}</text>
			</view>
			<view class="info-item">
				<text class="label">招租状态：</text>
				<text class="value">{{ projectData.status }}</text>
			</view>
			<view class="info-item">
				<text class="label">可租面积：</text>
				<text class="value">{{ projectData.vacantArea }}㎡</text>
			</view>
			<view class="info-item">
				<text class="label">空置率：</text>
				<text class="value">{{ projectData.vacancyRate }}%</text>
			</view>
			<view class="info-item">
				<text class="label">楼层情况：</text>
				<text class="value">{{ projectData.floorInfo }}</text>
			</view>
		</view>
		
		<!-- 项目介绍 -->
		<view class="info-card">
			<view class="card-title">项目介绍</view>
			<view class="project-desc">{{ projectData.description }}</view>
		</view>
		
		<!-- 入驻企业信息（仅登录用户可见） -->
		<view class="info-card" v-if="isLogin">
			<view class="card-title">入驻企业信息</view>
			<view class="company-list">
				<view class="company-item" v-for="(company, index) in projectData.companies" :key="index">
					<view class="company-info">
						<text class="company-name">{{ company.name }}</text>
						<text class="company-area">入驻面积：{{ company.area }}㎡</text>
						<text class="company-period">租期：{{ company.period }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 租金价格（仅登录用户可见） -->
		<view class="info-card" v-if="isLogin">
			<view class="card-title">租金价格</view>
			<view class="price-list">
				<view class="price-item" v-for="(price, index) in projectData.prices" :key="index">
					<text class="floor-range">{{ price.floor }}</text>
					<text class="price-value">{{ price.price }}元/㎡/月</text>
					<text class="payment-method">{{ price.payment }}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部导航按钮 -->
		<view class="nav-button-container">
			<button class="nav-button" @click="handleNavigation">一键导航</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: false,
				projectId: '',
				projectData: {
					name: '高联大厦',
					district: '鹿城区',
					address: '车站大道11号',
					status: '招租中',
					vacantArea: '2500',
					vacancyRate: '35',
					floorInfo: '5-8层、12层可租',
					description: '高联大厦位于温州市核心商圈，交通便利，配套完善。大厦总高25层，总建筑面积约3.5万平方米，是集办公、商业等多功能为一体的现代化商务大厦。',
					image: '',
					companies: [
						{
							name: '温州科技有限公司',
							area: '800',
							period: '2022-2025'
						},
						{
							name: '西创科技有限公司',
							area: '1200',
							period: '2023-2026'
						},
						{
							name: '浙江智能科技有限公司',
							area: '650',
							period: '2021-2024'
						}
					],
					prices: [
						{
							floor: '5-8层',
							price: '65',
							payment: '季付'
						},
						{
							floor: '9-15层',
							price: '75',
							payment: '季付'
						},
						{
							floor: '16-25层',
							price: '85',
							payment: '季付'
						}
					]
				}
			}
		},
		onLoad(options) {
			this.projectId = options.id;
			this.checkLoginStatus();
			this.loadProjectDetail();
		},
		methods: {
			checkLoginStatus() {
				const userData = uni.getStorageSync('User_data');
				this.isLogin = userData && userData.account !== undefined;
			},
			async loadProjectDetail() {
				try {
					// 这里替换为实际的云函数调用
					// const res = await uniCloud.callFunction({
					//   name: 'db-query',
					//   data: {
					//     collectionName: 'Project_data',
					//     id: this.projectId
					//   }
					// });
					// if (res.result && res.result.data) {
					//   this.projectData = res.result.data;
					// }
				} catch (err) {
					console.error('加载项目详情失败:', err);
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				}
			},
			// 处理导航
			handleNavigation() {
				// TODO: 实现导航功能
				console.log('导航到地址:', this.projectData.address);
			}
		}
	}
</script>

<style>
.detail-container {
	padding-bottom: 140rpx;
	background-color: #f5f5f5;
}

.project-header {
	position: relative;
}

.project-image {
	width: 100%;
	height: 400rpx;
}

.project-title {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	color: #fff;
	font-size: 36rpx;
	font-weight: bold;
	background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.info-card {
	margin: 20rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	border-left: 4rpx solid #2979FF;
	padding-left: 20rpx;
}

.info-item {
	display: flex;
	margin-bottom: 16rpx;
}

.label {
	width: 160rpx;
	color: #666;
	font-size: 28rpx;
}

.value {
	flex: 1;
	color: #333;
	font-size: 28rpx;
}

.project-desc {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.company-list {
	margin-top: 20rpx;
}

.company-item {
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
}

.company-item:last-child {
	border-bottom: none;
}

.company-info {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.company-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.company-area, .company-period {
	font-size: 26rpx;
	color: #666;
}

.price-list {
	margin-top: 20rpx;
}

.price-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
}

.price-item:last-child {
	border-bottom: none;
}

.floor-range {
	font-size: 28rpx;
	color: #333;
	width: 200rpx;
}

.price-value {
	font-size: 32rpx;
	color: #FF6B6B;
	font-weight: 500;
	flex: 1;
	text-align: center;
}

.payment-method {
	font-size: 26rpx;
	color: #666;
	width: 120rpx;
	text-align: right;
}

.nav-button-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.nav-button {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #2979FF;
	color: #fff;
	font-size: 32rpx;
	border-radius: 44rpx;
	border: none;
}

.nav-button:active {
	background-color: #2567e3;
}
</style>
