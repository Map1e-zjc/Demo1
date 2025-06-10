<template>
	<view class="detail-container">
		<!-- 项目基本信息 -->
		<view class="project-header">
			<image class="project-image" :src="processedImageUrl" mode="aspectFill" @error="handleImageError"
				:fade-show="false"></image>
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
				<text class="value">{{ $projectUtils.getVacantArea(projectData.rentalDetails) }}㎡</text>
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
				</view>
				<view class="company-row" v-for="(company, index) in projectData.companies" :key="index">
					<text class="company-column name-col">{{ company.name }}</text>
					<text class="company-column area-col highlight">{{ company.area }}㎡</text>
				</view>
			</view>
			<view class="no-data" v-if="!projectData.companies || projectData.companies.length === 0">暂无入驻企业</view>
		</view>
	</view>
</template>

<script>
import LoadingComponent from '@/components/LoadingComponent.vue'
export default {
	data() {
		return {
			isLogin: true,
			projectData: {}, // 初始为空对象
			processedImageUrl: '' // 经过处理的图片URL
		}
	},
	onLoad() {
		this.getData()
	},
	methods: {
		async getData() {
			const previewData = uni.getStorageSync('Preview_data');

			if (!previewData) {
				console.error('未找到预览数据');
				this.projectData = {};
				return;
			}

			// 深拷贝避免数据污染
			this.projectData = JSON.parse(JSON.stringify(previewData));

			// 设置初始图片URL为空字符串
			this.processedImageUrl = '';

			// 处理图片路径
			await this.processImage();

		},

		// 单独提取图片处理逻辑
		async processImage() {
			// 如果没有图片，直接返回
			if (!this.projectData.image) {
				return;
			}

			// 如果用户已经上传过云存储文件
			if (this.projectData.image.indexOf('cloud://') === 0) {
				try {
					// 直接获取临时URL，不使用缓存
					const fileRes = await uniCloud.getTempFileURL({
						fileList: [this.projectData.image]
					});

					if (fileRes.fileList && fileRes.fileList.length > 0) {
						this.processedImageUrl = fileRes.fileList[0].tempFileURL;
					}
				} catch (e) {
					console.error('获取图片URL失败:', e);
				}
			} else {
				// 非云存储路径，直接使用
				this.processedImageUrl = this.projectData.image;
			}
		},

		
		handleImageError(e) {
			console.warn('图片加载失败:', e);
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
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
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
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.name-col {
	width: 60%;
	text-align: left;
	padding-left: 20rpx;
}

.area-col {
	width: 40%;
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
