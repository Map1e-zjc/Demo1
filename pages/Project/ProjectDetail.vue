<template>
	<view class="detail-container">
		<LoadingComponent
		  :isLoading="isLoading" 
		  text="项目内容加载中"
		  color="#2979FF"
		  :size="40"
		/>
		<!-- 项目基本信息 -->
		<view class="project-header">
			<image class="project-image" :src="projectData.image" mode="aspectFill" :fade-show="false"></image>
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
				<text class="label">招商状态：</text>
				<text class="value">{{ projectData.investmentStatus }}</text>
			</view>
			<view class="info-item">
				<text class="label">招租面积：</text>
				<text class="value">{{ projectData.LeasingArea }}㎡</text>
			</view>
		</view>

		<!-- 项目介绍 -->
		<view class="info-card">
			<view class="card-title">项目介绍</view>
			<view class="project-desc">{{ projectData.description }}</view>
		</view>

		<!-- 详细信息（仅登录用户可见） -->
		<view class="info-card" v-if="isLogin">
			<view class="card-title">详细信息</view>
			<view class="info-item">
				<text class="label">入驻面积：</text>
				<text class="value">{{ projectData.OccupancyArea }}㎡</text>
			</view>
			<view class="info-item">
				<text class="label">可租面积：</text>
				<text class="value">{{ getVacantArea() }}㎡</text>
			</view>
			<view class="info-item">
				<text class="label">空置率：</text>
				<text class="value">{{ getVacancyRate() }}%</text>
			</view>
		</view>

		<!-- 入驻企业信息（仅登录用户可见） -->
		<view class="info-card" v-if="isLogin && projectData.companies && projectData.companies.length > 0">
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
		<view class="info-card" v-if="isLogin && projectData.prices && projectData.prices.length > 0">
			<view class="card-title">租金价格</view>
			<view class="price-list">
				<view class="price-item" v-for="(price, index) in projectData.prices" :key="index">
					<text class="floor-range">{{ price.floor }}</text>
					<text class="price-value">{{ price.rent }}元/㎡/月</text>
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
import LoadingComponent from '@/components/LoadingComponent.vue'
export default {
	data() {
		return {
			isLogin: false,
			projectId: '',
			projectData: {}, // 初始为空对象
			imageCache: {} ,// 图片缓存
			isLoading:true,
		}
	},
	onLoad(options) {
		this.projectId = options.id;
		this.checkLoginStatus();
		
		// 获取保存的图片缓存
		const cachedImages = uni.getStorageSync('project_image_cache');
		if (cachedImages) {
			this.imageCache = cachedImages;
		}
		
		this.loadProjectDetail();
	},
	methods: {
		// 计算空置面积：招租面积 - 入驻面积
		getVacantArea() {
			return this.projectData.LeasingArea - this.projectData.OccupancyArea;
		},
		// 计算空置率：空置面积 / 招租面积 * 100
		getVacancyRate() {
			if (!this.projectData.LeasingArea || this.projectData.LeasingArea === 0) return 0;
			const vacantArea = this.getVacantArea();
			const rate = (vacantArea / this.projectData.LeasingArea * 100).toFixed(1);
			return rate;
		},
		checkLoginStatus() {
			const userData = uni.getStorageSync('User_data');
			this.isLogin = userData && userData.account !== undefined;
		},
		async loadProjectDetail() {
			try {
				// 调用云函数获取项目详情
				const res = await uniCloud.callFunction({
					name: 'db-query',
					data: {
						collectionName: 'Project_data',
						query: { _id: this.projectId }
					}
				});
				if (res.result && res.result.code === 200 && res.result.data && res.result.data.data && res.result.data.data.length > 0) {
					// 获取项目详情
					const projectData = res.result.data.data[0];

					// 确保数值字段为数字类型
					projectData.LeasingArea = Number(projectData.LeasingArea) || 0;
					projectData.OccupancyArea = Number(projectData.OccupancyArea) || 0;

					// 处理企业数据
					if (projectData.companies && projectData.companies.length) {
						projectData.companies.forEach(company => {
							company.area = Number(company.area) || 0;
						});
					}

					// 处理价格数据
					if (projectData.prices && projectData.prices.length) {
						projectData.prices.forEach(price => {
							price.rent = Number(price.rent) || 0;
						});
					}

					// 处理云存储图片URL
					if (projectData.image && projectData.image.indexOf('cloud://') === 0) {
						try {
							// 先检查缓存中是否已有图片URL
							if (this.imageCache[projectData.image]) {
								projectData.image = this.imageCache[projectData.image];
							} else {
								const fileRes = await uniCloud.getTempFileURL({
									fileList: [projectData.image]
								});

								if (fileRes.fileList && fileRes.fileList.length > 0) {
									// 更新缓存
									this.imageCache[projectData.image] = fileRes.fileList[0].tempFileURL;
									uni.setStorageSync('project_image_cache', this.imageCache);
									projectData.image = fileRes.fileList[0].tempFileURL;
								}
							}
						} catch (e) {
							console.error('获取图片URL失败:', e);
						}
					} else if (!projectData.image) {
						console.log('项目图片为空');
					}
					this.centerdata = res.result.data.data[0].accuratePosition;
					// 更新项目数据
					this.projectData = projectData;

				} else {
					console.error('项目详情数据格式错误', res.result);
					uni.showToast({
						title: '数据加载异常',
						icon: 'none'
					});
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}
				this.isLoading = false;
			} catch (err) {
				console.error('加载项目详情失败:', err);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		handleNavigation() {
			uni.showModal({
				title: '',
				  content: '进入地图页面?',
				  success: (res) => {
				    if (res.confirm) {
					 uni.setStorageSync('Center_data',this.centerdata)
				     uni.switchTab({
				     	url: '/pages/Index/Index'
				     });
				    } else if (res.cancel) {
				      return;
				    }
				  }
			})
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
	background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.info-card {
	margin: 20rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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

.company-area,
.company-period {
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
