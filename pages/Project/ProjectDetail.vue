<template>
	<view class="detail-container">
		<LoadingComponent :isLoading="isLoading" text="项目内容加载中" color="#2979FF" :size="40" />
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
				<text class="value">{{ projectData.district }} {{ projectData.street || '' }} {{ projectData.address }}</text>
			</view>
			<view class="info-item">
				<text class="label">招商状态：</text>
				<text class="value">{{ projectData.investmentStatus }}</text>
			</view>
			<view class="info-item">
				<text class="label">招租面积：</text>
				<text class="value">{{ $projectUtils.getTotalLeasingArea(projectData) }}㎡</text>
			</view>
		</view>

		<!-- 项目介绍 -->
		<view class="info-card">
			<view class="card-title">项目介绍</view>
			<view class="project-desc" :class="{ 'desc-expanded': isDescExpanded }">
				<template v-if="!isDescExpanded && projectData.description && projectData.description.length > 100">
					{{ projectData.description.substring(0, 100) + '...' }}
				</template>
				<template v-else>
					{{ projectData.description }}
				</template>
			</view>
			<view v-if="projectData.description && projectData.description.length > 100" class="desc-toggle"
				@click="toggleDescExpand">
				{{ isDescExpanded ? '收起' : '展开全部' }}
				<text class="toggle-icon">{{ isDescExpanded ? '↑' : '↓' }}</text>
			</view>
		</view>

		<!-- 详细信息（仅登录用户可见） -->
		<view class="info-card" v-if="isLogin">
			<view class="card-title">详细信息</view>
			<view class="info-item">
				<text class="label">入驻面积：</text>
				<text class="value">{{ $projectUtils.getOccupiedArea(projectData.companies) }}㎡</text>
			</view>
			<view class="info-item">
				<text class="label">可租面积：</text>
				<text class="value">{{ $projectUtils.getVacantArea(projectData.rentalDetails) }}㎡</text>
			</view>
			<view class="info-item">
				<text class="label">空置率：</text>
				<text class="value">{{ $projectUtils.getVacancyRate(projectData.companies, projectData.rentalDetails) }}%</text>
			</view>
		</view>

		<!-- 招租详情（仅登录用户可见）- 整合了租金和入驻企业信息 -->
		<view class="info-card"
			v-if="isLogin && (projectData.rentalDetails && projectData.rentalDetails.length > 0 || projectData.companies && projectData.companies.length > 0)">
			<view class="card-title">招租详情</view>

			<!-- 招租信息表格 -->
			<view class="section-title" v-if="projectData.rentalDetails && projectData.rentalDetails.length > 0">招租信息</view>
			<view class="rental-table" v-if="projectData.rentalDetails && projectData.rentalDetails.length > 0">
				<view class="rental-header">
					<text class="column building">楼栋</text>
					<text class="column floor">楼层</text>
					<text class="column area">空置面积</text>
					<text class="column price">租金价格</text>
				</view>
				<view class="rental-item" v-for="(price, index) in projectData.rentalDetails" :key="index">
					<text class="column building">{{ price.building || '-' }}</text>
					<text class="column floor">{{ price.floor }}</text>
					<text class="column area">{{ price.vacantArea }}㎡</text>
					<text class="column price highlight">{{ price.rent === '面议' ? '面议' : (isNaN(parseFloat(price.rent)) ?
						price.rent : parseFloat(price.rent) + '元/㎡/月') }}</text>
				</view>
			</view>
			<view class="no-data" v-if="!projectData.rentalDetails || projectData.rentalDetails.length === 0">暂无招租信息</view>

			<!-- 入驻企业信息列表 -->
			<view class="section-divider"></view>
			<view class="section-title" v-if="projectData.companies && projectData.companies.length > 0">入驻企业</view>
			<view class="company-table" v-if="projectData.companies && projectData.companies.length > 0">
				<view class="company-header">
					<text class="company-column name-col">企业名称</text>
					<text class="company-column area-col">入驻面积</text>
					<text class="company-column position-col">入驻位置</text>
				</view>
				<view class="company-row" v-for="(company, index) in projectData.companies" :key="index">
					<text class="company-column name-col">{{ company.name }}</text>
					<text class="company-column area-col highlight">{{ company.area }}㎡</text>
					<text class="company-column position-col">{{ company.position }}</text>
				</view>
			</view>
			<view class="no-data" v-if="!projectData.companies || projectData.companies.length === 0">暂无入驻企业</view>
		</view>

		<!-- 底部空白区域，用于增加间距 -->
		<view class="bottom-spacing"></view>

		<!-- 底部导航按钮 -->
		<view class="nav-button-container">
			<view class="button-row" v-if="isLogin">
				<button class="nav-button edit-button" @click="handleEdit">编辑项目</button>
			</view>
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
			imageCache: {},// 图片缓存
			isLoading: true,
			isDescExpanded: false,
		}
	},
	onShow() {
		this.checkLoginStatus();
		// 从编辑页面返回时，直接重新加载数据
		if (this.projectId) {
			this.isLoading = true;
			this.loadProjectDetail();
		}
	},
	onLoad(options) {
		this.projectId = options.id;

		// 获取保存的图片缓存
		const cachedImages = uni.getStorageSync('project_image_cache');
		if (cachedImages) {
			this.imageCache = cachedImages;
		}

		this.loadProjectDetail();
	},
	methods: {
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
						uni.setStorageSync('Center_data', this.centerdata)
						uni.switchTab({
							url: '/pages/Index/Index'
						});
					} else if (res.cancel) {
						return;
					}
				}
			})
		},
		handleEdit() {
			// 将项目数据存储到本地，以便编辑页面使用
			uni.setStorageSync('EditProject_data', this.projectData);
			uni.navigateTo({
				url: `/pages/Project/ManageProject?id=${this.projectId}`
			});
		},
		toggleDescExpand() {
			this.isDescExpanded = !this.isDescExpanded;
		}
	}
}
</script>

<style>
.detail-container {
	padding-bottom: 180rpx;
	/* 增加底部内边距 */
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

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #555;
	margin: 30rpx 0 15rpx 0;
}

.section-divider {
	height: 20rpx;
	margin: 20rpx 0;
	border-bottom: 1px dashed #eee;
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
	max-height: 200rpx;
	overflow: hidden;
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

.company-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.company-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.company-area {
	font-size: 28rpx;
}

.company-period {
	font-size: 26rpx;
	color: #666;
}

/* 招租详情表格样式 */
.rental-table {
	width: 100%;
	border-top: 1rpx solid #eee;
	border-left: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.rental-header,
.rental-item {
	display: flex;
	width: 100%;
	border-bottom: 1rpx solid #eee;
}

.rental-header {
	background-color: #f9f9f9;
	font-weight: 500;
}

.column {
	padding: 20rpx 10rpx;
	font-size: 26rpx;
	text-align: center;
	border-right: 1rpx solid #eee;
	word-wrap: break-word;
	word-break: break-all;
	white-space: normal;
	line-height: 1.4;
	min-height: 56rpx;
}

.building {
	width: 20%;
}

.floor {
	width: 20%;
}

.area {
	width: 25%;
}

.price {
	width: 35%;
}

/* 企业信息表格样式 */
.company-table {
	width: 100%;
	border-top: 1rpx solid #eee;
	border-left: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.company-header,
.company-row {
	display: flex;
	width: 100%;
	border-bottom: 1rpx solid #eee;
}

.company-header {
	background-color: #f9f9f9;
	font-weight: 500;
}

.company-column {
	padding: 20rpx 10rpx;
	font-size: 26rpx;
	text-align: center;
	border-right: 1rpx solid #eee;
	word-wrap: break-word;
	word-break: break-all;
	white-space: normal;
	line-height: 1.4;
	min-height: 56rpx;
}

.name-col {
	width: 40%;
	text-align: left;
	padding-left: 20rpx;
}

.area-col {
	width: 25%;
}

.position-col {
	width: 35%;
	text-align: left;
	padding-left: 15rpx;
}

.period-col {
	width: 35%;
}

.highlight {
	color: #FF6B6B;
	font-weight: 500;
}

.no-data {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
	font-size: 28rpx;
}

.bottom-spacing {
	height: 50rpx;
	/* 添加额外的底部间距元素 */
}

.nav-button-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 100;
	/* 确保按钮在最上层 */
}

.button-row {
	margin-bottom: 20rpx;
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

.edit-button {
	background-color: #FF9500;
}

.nav-button:active {
	background-color: #2567e3;
}

.edit-button:active {
	background-color: #e58500;
}

.desc-expanded {
	max-height: none !important;
	overflow: visible;
}

.desc-toggle {
	color: #2979FF;
	font-size: 28rpx;
	margin-top: 10rpx;
	padding: 10rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 1rpx dashed #eee;
}

.toggle-icon {
	margin-left: 10rpx;
	font-weight: bold;
}
</style>
