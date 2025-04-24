<template>
	<view class="project-container">
		    <!-- 新增加载组件 -->
		    <LoadingComponent 
		      :isLoading="isLoading" 
		      text="项目列表加载中"
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
		
		<!-- 街道筛选器，当选择了特定区域时显示 -->
		<view class="street-filter" v-if="currentTab > 0">
			<view class="filter-header" @click="toggleStreetDropdown">
				<text class="filter-title">{{ selectedStreet || '全部街道' }}</text>
				<text class="filter-icon" :class="{ 'rotate': showStreetDropdown }">▼</text>
			</view>
			<!-- 街道下拉列表 -->
			<view class="street-dropdown" v-if="showStreetDropdown">
				<view 
					class="street-item" 
					@click="selectStreet('')"
					:class="{ 'active': selectedStreet === '' }"
				>
					全部街道
				</view>
				<view 
					v-for="(street, index) in availableStreets" 
					:key="index"
					class="street-item"
					:class="{ 'active': selectedStreet === street }"
					@click="selectStreet(street)"
				>
					{{ street }}
				</view>
			</view>
		</view>
		
		<!-- 项目列表 -->
		<scroll-view scroll-y class="project-list" :class="{ 'with-filter': currentTab > 0 }">
			<view 
				v-for="(item, index) in filteredProjects" 
				:key="index"
				class="project-card"
				@click="goToDetail(item._id)"
			>
				<!-- 项目图片 -->
				<view class="project-image">
					<image 
						:src="item.image" 
						mode="aspectFill"
						:fade-show="false"
						:lazy-load="true"
					></image>
					<view class="status-tag">{{ item.investmentStatus }}</view>
				</view>
				
				<!-- 项目信息 -->
				<view class="project-info">
					<view class="project-title">{{ item.name }}</view>
					<view class="project-address">{{ item.district }} {{ item.street || '' }} {{ item.address }}</view>
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
							<text class="info-value">{{ getRentRange(item) }}</text>
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
				projects: [],
				imageCache: {}, // 新增图片缓存
				selectedStreet: '', // 当前选择的街道
				showStreetDropdown: false, // 是否显示街道下拉菜单
				streetsMap: {}, // 存储从数据库获取的街道信息，格式 {district: [street1, street2, ...]}
			}
		},
		computed: {
			// 根据当前选择的区域返回可用的街道列表
			availableStreets() {
				if (this.currentTab > 0) {
					const district = this.tabs[this.currentTab];
					return this.streetsMap[district] || [];
				}
				return [];
			},
			// 按区域和街道过滤项目
			filteredProjects() {
				let result = this.projects;
				
				// 首先按区域过滤
				if (this.currentTab > 0) {
					const district = this.tabs[this.currentTab];
					result = this.projects.filter(item => item.district === district);
					
					// 如果选择了街道，继续过滤
					if (this.selectedStreet) {
						result = result.filter(item => item.street === this.selectedStreet);
					}
				}
				
				return result;
			}
		},
		onShow() {
			// 每次页面显示时检查登录状态
			this.checkLoginStatus();
			// 如果数据为空才重新加载
			if (this.projects.length === 0) {
				this.isLoading = true;
				this.loadProjects();
			}
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
				if (!item.rentalDetails || item.rentalDetails.length === 0) return '暂无';
				
				// 检查是否有"面议"的租金
				const hasNegotiableRent = item.rentalDetails.some(price => price.rent === '面议');
				if (hasNegotiableRent) return '面议';
				
				// 尝试获取数字范围
				let validRents = item.rentalDetails
					.map(price => price.rent)
					.filter(rent => !isNaN(parseFloat(rent)))
					.map(rent => parseFloat(rent));
				
				if (validRents.length === 0) return '暂无';
				
				let minRent = Math.min(...validRents);
				let maxRent = Math.max(...validRents);
				
				if (minRent === maxRent) return minRent + '元/㎡/月';
				return `${minRent}-${maxRent}元/㎡/月`;
			},
			checkLoginStatus() {
				const userData = uni.getStorageSync('User_data');
				this.isLogin = userData && userData.account !== undefined;
			},
			switchTab(index) {
				this.currentTab = index;
				// 切换标签时重置街道选择
				this.selectedStreet = '';
				this.showStreetDropdown = false;
			},
			// 切换街道下拉菜单的显示状态
			toggleStreetDropdown() {
				this.showStreetDropdown = !this.showStreetDropdown;
			},
			// 选择街道
			selectStreet(street) {
				this.selectedStreet = street;
				this.showStreetDropdown = false;
			},
			goToDetail(id) {
				uni.navigateTo({
					url: `/pages/Project/ProjectDetail?id=${id}`
				});
			},
			// 从项目数据中提取街道信息
			extractStreetsFromProjects(projects) {
				const streetsMap = {};
				
				projects.forEach(project => {
					// 如果项目有区域和街道信息
					if (project.district && project.street) {
						// 如果这个区域还没有在映射表中，先初始化一个空数组
						if (!streetsMap[project.district]) {
							streetsMap[project.district] = [];
						}
						
						// 如果这个街道还没有被添加到区域的街道列表中，则添加
						if (!streetsMap[project.district].includes(project.street)) {
							streetsMap[project.district].push(project.street);
						}
					}
				});
				
				// 对每个区域的街道进行排序
				for (const district in streetsMap) {
					streetsMap[district].sort();
				}
				
				return streetsMap;
			},
			async loadProjects() {
				try {
					// 调用云函数获取项目数据
					const res = await uniCloud.callFunction({
						name: 'db-query',
						data: {
							collectionName: 'Project_data',
							query: {status: 'published'},
							// 只查询需要的字段，添加street字段
							options: {
								fields: '_id,name,district,street,address,LeasingArea,companies,OccupancyArea,rentalDetails,image,investmentStatus'
							}
						}
					});
					
					if (res.result && res.result.code === 200 && res.result.data && res.result.data.data) {
						// 获取项目数据
						const projects = res.result.data.data;
						
						// 处理图片URL和数据格式
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
							
							// 处理招租详情数据
							if (project.rentalDetails && project.rentalDetails.length) {
								project.rentalDetails.forEach(price => {
									// 租金保持原始字符串格式，只处理空置面积
									if (price.vacantArea) {
										price.vacantArea = Number(price.vacantArea) || 0;
									}
								});
							}
							
							// 处理云存储图片URL
							if (project.image && project.image.indexOf('cloud://') === 0) {
								try {
									// 检查缓存中是否已有此图片的URL
									if (this.imageCache[project.image]) {
										project.image = this.imageCache[project.image];
										continue;
									}

									const fileRes = await uniCloud.getTempFileURL({
										fileList: [project.image]
									});

									if (fileRes.fileList && fileRes.fileList.length > 0) {
										// 保存图片URL到缓存
										this.imageCache[project.image] = fileRes.fileList[0].tempFileURL;
										project.image = fileRes.fileList[0].tempFileURL;
									}
								} catch (e) {
									console.error('获取图片URL失败:', e);
								}
							} else if (!project.image) {
								console.log('项目图片为空');
							}
						}
						
						// 从项目数据中提取街道信息
						this.streetsMap = this.extractStreetsFromProjects(projects);
						console.log('街道信息提取完成:', this.streetsMap);
						
						// 更新项目数据
						this.projects = projects;
						console.log('项目数据处理完成，共', this.projects.length, '条');
						
						// 将图片缓存保存到本地，以便页面返回时使用
						uni.setStorageSync('project_image_cache', this.imageCache);
						
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
		},
		onLoad() {
			// 加载已保存的图片缓存
			const cachedImages = uni.getStorageSync('project_image_cache');
			if (cachedImages) {
				this.imageCache = cachedImages;
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

/* 街道筛选器样式 */
.street-filter {
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
	position: relative;
	z-index: 10;
}

.filter-header {
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
}

.filter-title {
	font-size: 28rpx;
	color: #333;
}

.filter-icon {
	font-size: 24rpx;
	color: #999;
	transition: transform 0.3s;
}

.filter-icon.rotate {
	transform: rotate(180deg);
}

.street-dropdown {
	position: absolute;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
	z-index: 11;
	max-height: 480rpx;
	overflow-y: auto;
}

.street-item {
	height: 80rpx;
	line-height: 80rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	color: #333;
	border-bottom: 1rpx solid #f5f5f5;
}

.street-item.active {
	color: #2979FF;
	background-color: #f5f7ff;
}

.project-list {
	flex: 1;
	padding: 20rpx;
}

.project-list.with-filter {
	padding-top: 20rpx;
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
