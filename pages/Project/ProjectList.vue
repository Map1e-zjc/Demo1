<template>
	<view class="project-container">
		    <!-- 新增加载组件 -->
		    <LoadingComponent 
		      :isLoading="isLoading" 
		      text="项目加载中"
		      color="#2979FF"
		      :size="40"
		    />
		<!-- 顶部标签页 -->
		<view class="tab-header">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index" 
				:class="['tab-item', currentTab === index ? 'active' : '']"
				@click="switchTab(index)"
			>
				{{ tab }}
			</view>
		</view>
		
		<!-- 项目列表 -->
		<scroll-view scroll-y class="project-list">
			<view 
				v-for="(item, index) in filteredProjects" 
				:key="index"
				class="project-card"
				@click="goToDetail(item._id)"
			>
				<!-- 项目图片 -->
				<view class="project-image">
					<image :src="item.image" mode="aspectFill"></image>
					<view class="status-tag">{{ item.investmentStatus }}</view>
				</view>
				
				<!-- 项目信息 -->
				<view class="project-info">
					<view class="project-title">{{ item.name }}</view>
					<view class="project-address">{{ item.district }} {{ item.address }}</view>
					<view class="project-data">
						<text class="data-item">招租面积: {{ item.LeasingArea }}㎡</text>
					</view>
					
					<!-- 内部信息（登录可见） -->
					<view class="internal-info" v-if="isLogin">
						<view class="divider"></view>
						<view class="company-info">
							<text class="info-label">入驻企业：</text>
							<text class="info-value">{{ item.companies ? item.companies.length : 0 }}家</text>
						</view>
						<view class="company-info">
							<text class="info-label">入驻面积：</text>
							<text class="info-value">{{ item.OccupancyArea }}㎡</text>
						</view>
						<view class="company-info">
							<text class="info-label">可租面积：</text>
							<text class="info-value">{{ getVacantArea(item) }}㎡</text>
						</view>
						<view class="company-info">
							<text class="info-label">空置率：</text>
							<text class="info-value">{{ getVacancyRate(item) }}%</text>
						</view>
						<view class="rent-info">
							<text class="info-label">租金范围：</text>
							<text class="info-value">{{ getRentRange(item) }}元/㎡/月</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 无数据提示 -->
			<view class="no-data" v-if="filteredProjects.length === 0">
				暂无项目数据
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import LoadingComponent from '@/components/LoadingComponent.vue'
	export default {
		components: {
		    LoadingComponent
		  },
		data() {
			return {
				isLogin: false,
				isLoading : true,
				currentTab: 0,
				tabs: ['全部', '鹿城区', '瓯海区'],
				projects: []
			}
		},
		computed: {
			filteredProjects() {
				if (this.currentTab === 0) {
					return this.projects;
				} else {
					const district = this.tabs[this.currentTab];
					return this.projects.filter(item => item.district === district);
				}
			}
		},
		onShow() {
			// 每次页面显示时检查登录状态
			this.checkLoginStatus();
			this.loadProjects();
		},
		methods: {
			// 计算空置面积：招租面积 - 入驻面积
			getVacantArea(item) {
				return item.LeasingArea - item.OccupancyArea;
			},
			// 计算空置率：空置面积 / 招租面积 * 100
			getVacancyRate(item) {
				if (!item.LeasingArea || item.LeasingArea === 0) return 0;
				const vacantArea = this.getVacantArea(item);
				const rate = (vacantArea / item.LeasingArea * 100).toFixed(1);
				return rate;
			},
			// 获取租金范围
			getRentRange(item) {
				if (!item.prices || item.prices.length === 0) return '暂无';
				let minRent = Infinity;
				let maxRent = 0;
				
				item.prices.forEach(price => {
					if (price.rent < minRent) minRent = price.rent;
					if (price.rent > maxRent) maxRent = price.rent;
				});
				
				if (minRent === maxRent) return minRent;
				return `${minRent}-${maxRent}`;
			},
			checkLoginStatus() {
				const userData = uni.getStorageSync('User_data');
				this.isLogin = userData && userData.account !== undefined;
			},
			switchTab(index) {
				this.currentTab = index;
			},
			goToDetail(id) {
				uni.navigateTo({
					url: `/pages/Project/ProjectDetail?id=${id}`
				});
			},
			async loadProjects() {
				try {
					// 调用云函数获取项目数据
					const res = await uniCloud.callFunction({
						name: 'db-query',
						data: {
							collectionName: 'Project_data',
							query: {status: 'published'}
						}
					});
					
					if (res.result && res.result.code === 200 && res.result.data && res.result.data.data) {
						// 获取项目数据
						const projects = res.result.data.data;
						
						// 处理图片URL
						for (const project of projects) {
							// 确保数值字段为数字类型
							project.LeasingArea = Number(project.LeasingArea) || 0;
							project.OccupancyArea = Number(project.OccupancyArea) || 0;
							
							// 处理企业数据
							if (project.companies && project.companies.length) {
								project.companies.forEach(company => {
									company.area = Number(company.area) || 0;
								});
							}
							
							// 处理价格数据
							if (project.prices && project.prices.length) {
								project.prices.forEach(price => {
									price.rent = Number(price.rent) || 0;
								});
							}
							
							// 处理云存储图片URL
							if (project.image && project.image.indexOf('cloud://') === 0) {
								try {

									const fileRes = await uniCloud.getTempFileURL({
										fileList: [project.image]
									});

									if (fileRes.fileList && fileRes.fileList.length > 0) {
										project.image = fileRes.fileList[0].tempFileURL;
									}
								} catch (e) {
									console.error('获取图片URL失败:', e);
								}
							} else if (!project.image) {
								console.log('项目图片为空');
							}
						}
						
						// 更新项目数据
						this.projects = projects;
						console.log('项目数据处理完成，共', this.projects.length, '条');
						
					} else {
						console.error('项目数据格式错误', res.result);
						uni.showToast({
							title: '数据加载异常',
							icon: 'none'
						});
					}
					this.isLoading = false;
				} catch (err) {
					console.error('加载项目数据失败', err);
					this.isLoading = false;
					uni.showToast({
						title: '加载数据失败',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style>
.project-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
}

.tab-header {
	display: flex;
	background-color: #ffffff;
	border-bottom: 1px solid #e5e5e5;
}

.tab-item {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #2979FF;
	font-weight: 500;
}

.tab-item.active::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 25%;
	width: 50%;
	height: 4rpx;
	background-color: #2979FF;
}

.project-list {
	flex: 1;
	padding: 20rpx;
}

.project-card {
	margin-bottom: 20rpx;
	background-color: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.project-image {
	height: 240rpx;
	position: relative;
	background-color: #eee;
}

.project-image image {
	width: 100%;
	height: 100%;
}

.status-tag {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	background-color: #FF6B6B;
	color: #fff;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
}

.project-info {
	padding: 20rpx;
}

.project-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.project-address {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.project-data {
	display: flex;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 8rpx;
}

.data-item {
	margin-right: 30rpx;
}

.no-data {
	text-align: center;
	padding: 100rpx 0;
	color: #999;
	font-size: 28rpx;
}

.internal-info {
	margin-top: 16rpx;
}

.divider {
	height: 1rpx;
	background-color: #eee;
	margin: 16rpx 0;
}

.company-info, .rent-info {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	margin-top: 8rpx;
}

.info-label {
	color: #666;
	width: 140rpx;
}

.info-value {
	color: #333;
	flex: 1;
}
</style>
