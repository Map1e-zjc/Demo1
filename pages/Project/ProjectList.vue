<template>
	<view class="project-container">
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
					<image :src="item.image || '/static/image/test.png'" mode="aspectFill"></image>
					<view class="status-tag">{{ item.status }}</view>
				</view>
				
				<!-- 项目信息 -->
				<view class="project-info">
					<view class="project-title">{{ item.name }}</view>
					<view class="project-address">{{ item.district }} {{ item.address }}</view>
					<view class="project-data">
						<text class="data-item">可租面积: {{ item.vacantArea }}㎡</text>
						<text class="data-item">空置率: {{ item.vacancyRate }}%</text>
					</view>
					
					<!-- 内部信息（登录可见） -->
					<view class="internal-info" v-if="isLogin">
						<view class="divider"></view>
						<view class="company-info">
							<text class="info-label">入驻企业：</text>
							<text class="info-value">{{ item.companyCount }}家</text>
						</view>
						<view class="rent-info">
							<text class="info-label">租金范围：</text>
							<text class="info-value">{{ item.rentRange }}元/㎡/月</text>
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
	export default {
		data() {
			return {
				isLogin: false,
				currentTab: 0,
				tabs: ['全部', '鹿城区', '瓯海区'],
				projects: [
					{
						_id: '1',
						name: '高联大厦',
						district: '鹿城区',
						address: '车站大道11号',
						vacantArea: '2500',
						vacancyRate: '35', //后续需要计算得出
						status: '招租中',
						image: '',
						companyCount: '2', //后续需要计算得出
						rentRange: '60-80' //后续需要计算得出
					},
					{
						_id: '2',
						name: '瑞丰大厦',
						district: '鹿城区',
						address: '解放路88号',
						vacantArea: '1800',
						vacancyRate: '20',
						status: '招租中',
						image: '',
						companyCount: '3',
						rentRange: '65-85'
					},
					{
						_id: '3',
						name: '丽江公馆',
						district: '瓯海区',
						address: '丽江路120号',
						vacantArea: '3200',
						vacancyRate: '45',
						status: '招租中',
						image: '',
						companyCount: '2',
						rentRange: '70-90'
					}
				]
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
					// 这里可以替换为实际的云函数调用
					// const res = await uniCloud.callFunction({
					//   name: 'db-query',
					//   data: {
					//     collectionName: 'Project_data'
					//   }
					// });
					// if (res.result && res.result.data) {
					//   this.projects = res.result.data;
					// }
				} catch (err) {
					console.error('加载项目数据失败', err);
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
