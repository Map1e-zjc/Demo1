<template>
	<view class="form-container">
		<text class="title">项目信息编辑</text>

		<view class="form-content">
			<!-- 基础信息 -->
			<view class="form-section">
				<text class="input-label">项目名称</text>
				<input v-model="form.name" placeholder="项目名称*" class="input-field" />
				<view class="district-group">
					<text class="district-label">所属城区*</text>
					<view class="radio-group">
						<view class="radio-item" :class="{ active: form.district === '鹿城区' }" @click="form.district = '鹿城区'">
							<text>鹿城区</text>
							<view class="radio-icon" v-if="form.district === '鹿城区'"></view>
						</view>
						<view class="radio-item" :class="{ active: form.district === '瓯海区' }" @click="form.district = '瓯海区'">
							<text>瓯海区</text>
							<view class="radio-icon" v-if="form.district === '瓯海区'"></view>
						</view>
					</view>
				</view>
				<text class="input-label">街道名称</text>
				<input v-model="form.street" placeholder="街道名称*" class="input-field" />
				<text class="input-label">详细地址</text>
				<input v-model="form.address" placeholder="详细地址*" class="input-field" />
				
				<text class="input-label">项目描述</text>
				<view class="textarea-container">
					<textarea 
						v-model="form.description" 
						placeholder="项目描述*" 
						class="textarea" 
						auto-height 
						maxlength="-1"
						show-confirm-bar="false"
					/>
				</view>
			</view>

			<!-- 招商状态 -->
			<view class="form-section">
				<text class="district-label">招商状态*</text>
				<view class="radio-group">
					<view class="radio-item" :class="{ active: form.investmentStatus === '招租中' }"
						@click="form.investmentStatus = '招租中'">
						<text>招租中</text>
						<view class="radio-icon" v-if="form.investmentStatus === '招租中'"></view>
					</view>
					<view class="radio-item" :class="{ active: form.investmentStatus === '已出租' }"
						@click="form.investmentStatus = '已出租'">
						<text>已出租</text>
						<view class="radio-icon" v-if="form.investmentStatus === '已出租'"></view>
					</view>
					<view class="radio-item" :class="{ active: form.investmentStatus === '预保留' }"
						@click="form.investmentStatus = '预保留'">
						<text>预保留</text>
						<view class="radio-icon" v-if="form.investmentStatus === '预保留'"></view>
					</view>
				</view>
			</view>

			<!-- 入驻企业信息 -->
			<view class="form-section">
				<text class="section-title">入驻企业管理</text>
				<view class="repeat-group" v-for="(company, index) in form.companies" :key="index">
					<view class="repeat-header">
						<text>企业 {{ index + 1 }}</text>
						<text v-if="form.companies.length > 1" @click="removeCompany(index)"
							style="font-size: 24px; color: #ff4d4f;">×</text>
					</view>
					<text class="input-label">企业名称</text>
					<input v-model="company.name" placeholder="企业名称*" class="input-field" />
					<text class="input-label">入驻面积(㎡)</text>
					<input v-model="company.area" type="number" placeholder="入驻面积(㎡)*" class="input-field" />
					<text class="input-label">入驻位置</text>
					<input v-model="company.position" placeholder="入驻位置*" class="input-field" />
				</view>
				<button class="add-btn" @click="addCompany">
					<uni-icons type="plus" size="28rpx" />
					添加企业
				</button>
			</view>
			<!-- 招租详情信息 -->
			<view class="form-section">
				<text class="section-title">招租详情管理</text>
				<view class="repeat-group" v-for="(detail, index) in form.rentalDetails" :key="index">
					<view class="repeat-header">
						<text>招租 {{ index + 1 }}</text>
						<text v-if="form.rentalDetails.length > 1" @click="removeRental(index)"
							style="font-size: 24px; color: #ff4d4f;">×</text>
					</view>
					<text class="input-label">楼栋</text>
					<input v-model="detail.building" placeholder="楼栋*" class="input-field" />
					<text class="input-label">楼层</text>
					<input v-model="detail.floor" placeholder="楼层*" class="input-field" />
					<text class="input-label">空置面积(㎡)</text>
					<input v-model="detail.vacantArea" type="number" placeholder="空置面积(㎡)*" class="input-field" />
					<text class="input-label">租金(元/㎡/月)</text>
					<input v-model="detail.rent" placeholder="租金(元/㎡/月)* 填写数字或'面议'" class="input-field" />
				</view>
				<button class="add-btn" @click="addRentalDetail">
					<uni-icons type="plus" size="28rpx" />
					添加招租信息
				</button>
			</view>
			<!-- 图片上传 -->
			<view class="form-section">
				<text class="input-label">项目照片</text>
				<view class="upload-wrap" @click="uploadImage()">
					<text class="upload-text">{{ form.image ? '已上传' : '点击上传项目照片*' }}</text>
				</view>
			</view>
			<!-- 位置确定 -->
			<view class="form-section">
				<text class="input-label">项目位置</text>
				<view class="upload-wrap" @click="uploadPosition()">
					<text class="upload-text">{{ form.accuratePosition.latitude ? '已确定位置' : '点击跳转确认位置*' }}</text>
				</view>
			</view>
			<!-- 预览按钮 -->
			<button class="preview-btn" :disabled="!isFormValid" @click="ToPreview()">
				预览项目页面
			</button>
			<!-- 提交按钮 -->
			<button class="submit-btn" :disabled="!isFormValid" @click="handleSubmit()">
				保存修改
			</button>
		</view>
	</view>
</template>

<script>
import uploadImageFunction from '@/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/functions/upLoadImageFunction.js';
export default {
	data() {
		return {
			projectId: '',  // 项目ID
			form: {
				name: '',
				street: '',
				address: '',
				district: '鹿城区',
				accuratePosition: {
					longitude: null,
					latitude: null
				},
				description: '',
				status: 'published',
				investmentStatus: '',
				image: '',
				companies: [{}],
				rentalDetails: [{}],
			}
		}
	},
	onLoad(options) {
		// 获取项目ID
		this.projectId = options.id;

		// 加载项目数据
		this.loadProjectData();

		// 清理本地存储
		uni.removeStorageSync('Preview_data');
		uni.removeStorageSync('TempCenter_data');
	},
	onShow() {
		// 处理位置信息
		const centerdata = uni.getStorageSync('TempCenter_data');
		if (centerdata != '') {
			this.form.accuratePosition.latitude = centerdata.latitude;
			this.form.accuratePosition.longitude = centerdata.longitude;
		}
	},
	computed: {
		isFormValid() {
			const baseValid = [
				this.form.name,
				this.form.street,
				this.form.address,
				this.form.district,
				this.form.accuratePosition.longitude,
				this.form.accuratePosition.latitude,
				this.form.description,
				this.form.image
			].every(field => !!field)
			const companiesValid = this.form.companies.every(c =>
				c.name?.trim() && !isNaN(c.area)
			);

			const rentalValid = this.form.rentalDetails.every(d =>
				d.building?.trim() && d.floor?.trim() &&
				!isNaN(d.vacantArea) && (d.rent === '面议' || !isNaN(d.rent))
			);

			return baseValid && companiesValid && rentalValid;
		}
	},
	methods: {
		// 加载项目数据
		async loadProjectData() {
			try {
				// 优先从本地存储加载数据（从详情页面传递过来的）
				const storedData = uni.getStorageSync('EditProject_data');

				if (storedData && storedData._id === this.projectId) {
					// 使用本地存储的数据
					this.initFormWithProjectData(storedData);
				} else {
					// 如果本地没有数据或ID不匹配，则从数据库加载
					const res = await uniCloud.callFunction({
						name: 'db-query',
						data: {
							collectionName: 'Project_data',
							query: { _id: this.projectId }
						}
					});

					if (res.result && res.result.code === 200 && res.result.data && res.result.data.data && res.result.data.data.length > 0) {
						// 初始化表单数据
						this.initFormWithProjectData(res.result.data.data[0]);
					} else {
						uni.showToast({
							title: '项目数据加载失败',
							icon: 'none'
						});
						setTimeout(() => uni.navigateBack(), 1500);
					}
				}
			} catch (error) {
				console.error('加载项目数据失败:', error);
				uni.showToast({
					title: '项目数据加载失败',
					icon: 'none'
				});
				setTimeout(() => uni.navigateBack(), 1500);
			}
		},

		// 使用项目数据初始化表单
		initFormWithProjectData(projectData) {
			// 移除不需要的字段，保留 _id
			const { created_time,  ...cleanData } = projectData;

			// 初始化表单数据
			this.form = { ...cleanData };

			// 确保数值类型正确

			// 确保企业数组至少有一项
			if (!this.form.companies || this.form.companies.length === 0) {
				this.form.companies = [{}];
			}

			// 确保招租详情数组至少有一项
			if (!this.form.rentalDetails || this.form.rentalDetails.length === 0) {
				this.form.rentalDetails = [{}];
			}

			// 设置临时定位数据
			if (this.form.accuratePosition && this.form.accuratePosition.latitude) {
				uni.setStorageSync('TempCenter_data', {
					latitude: this.form.accuratePosition.latitude,
					longitude: this.form.accuratePosition.longitude
				});
			}
		},

		addCompany() {
			this.form.companies.push({ name: '', area: null });
		},
		removeCompany(index) {
			this.form.companies.splice(index, 1);
		},
		addRentalDetail() {
			this.form.rentalDetails.push({
				building: '',
				floor: '',
				vacantArea: null,
				rent: null
			});
		},
		removeRental(index) {
			this.form.rentalDetails.splice(index, 1);
		},
		async uploadImage() {
			try {
				uni.showLoading({ title: '上传中...' });
				const imageUrl = await uploadImageFunction.uploadImageFunction();

				uni.showToast({ title: '上传成功', icon: 'success' });
				console.log('图片地址:', imageUrl);
				this.form.image = imageUrl;
			} catch (err) {
				console.error('上传失败:', err);
				uni.showToast({ title: '上传失败，请重试', icon: 'none' });
			} finally {
				uni.hideLoading({ noConflict: true });
			}
		},
		uploadPosition() {
			uni.navigateTo({
				url: "/pages/Admin/Locate"
			})
		},
		ToPreview() {
			uni.setStorageSync('Preview_data', this.form);
			uni.navigateTo({
				url: "/pages/Admin/PreviewProject"
			})
		},
		async handleSubmit() {
			try {
				this.form.accuratePosition.latitude = parseFloat(this.form.accuratePosition.latitude)
				this.form.accuratePosition.longitude = parseFloat(this.form.accuratePosition.longitude)
				this.form.companies = this.form.companies.map(c => ({
					name: c.name.trim(),
					area: parseFloat(c.area)
				}));
				this.form.rentalDetails = this.form.rentalDetails.map(d => ({
					building: d.building.trim(),
					floor: d.floor.trim(),
					vacantArea: parseFloat(d.vacantArea),
					rent: d.rent.trim()
				}));

				// 调用云函数更新数据
				const res = await uniCloud.callFunction({
					name: 'db-update',
					data: {
						collectionName: 'Project_data',
						docId: this.projectId,
						data: this.form
					}
				});

				// 清理本地存储
				uni.removeStorageSync('Preview_data');
				uni.removeStorageSync('Temp_filename');
				uni.removeStorageSync('TempCenter_data');
				uni.removeStorageSync('EditProject_data');

				if (res.result && res.result.code === 200) {
					uni.showToast({ 
						title: '更新成功', 
						icon: 'success', 
						duration: 1500 
					});
					
					// 发送自定义事件通知列表页刷新
					uni.$emit('projectUpdated');
					
					setTimeout(() => uni.navigateBack(), 1500);
				} else {
					throw new Error(res.result?.message || '更新失败');
				}
			} catch (error) {
				console.error('更新失败:', error);
				uni.showToast({ title: `更新失败: ${error.message}`, icon: 'none' });
			}
		}
	}
}
</script>

<style scoped>
.form-container {
	padding: 40rpx;
	min-height: 100vh;
	background-color: #f8f9fa;
}

.title {
	display: block;
	font-size: 36rpx;
	color: #2c3e50;
	font-weight: 600;
	text-align: center;
	margin-bottom: 60rpx;
}

.form-content {
	background: white;
	border-radius: 16rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-section {
	margin-bottom: 48rpx;
}

.input-field {
	height: 96rpx;
	padding: 0 24rpx;
	margin-bottom: 32rpx;
	border: 2rpx solid #e0e3e6;
	border-radius: 12rpx;
	font-size: 28rpx;
}

.input-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
	font-weight: 500;
}

.district-group {
	margin-bottom: 32rpx;
}

.district-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 24rpx;
	padding-left: 8rpx;
}

.radio-group {
	display: flex;
	gap: 32rpx;
}

.radio-item {
	flex: 1;
	height: 96rpx;
	border: 2rpx solid #e0e3e6;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	transition: all 0.2s;
	position: relative;
}

.radio-item.active {
	border-color: #007aff;
	background-color: rgba(0, 122, 255, 0.05);
}

.radio-icon {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	background: #007aff;
	position: relative;
}

.half-width {
	flex: 1;
}

.textarea-container {
	position: relative;
	border: 2rpx solid #e0e3e6;
	border-radius: 12rpx;
	margin-bottom: 32rpx;
	min-height: 200rpx;
	max-height: 400rpx;
	overflow-y: auto;
}

.textarea {
	width: 100%;
	min-height: 200rpx;
	padding: 24rpx;
	line-height: 1.6;
	box-sizing: border-box;
	border: none;
	font-size: 28rpx;
}

.section-title {
	display: block;
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	margin: 32rpx 0;
	padding-left: 16rpx;
	border-left: 8rpx solid #007aff;
}

.repeat-group {
	border: 2rpx solid #e8e8e8;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 32rpx;
}

.repeat-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	padding-bottom: 16rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.add-btn {
	background: #f8f9fa;
	color: #007aff;
	border: 2rpx dashed #007aff;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
}

.upload-wrap {
	height: 96rpx;
	border: 2rpx dashed #e0e3e6;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.upload-text {
	color: #888;
	font-size: 28rpx;
}

.submit-btn,
.preview-btn {
	background: #007aff;
	color: white;
	height: 96rpx;
	line-height: 96rpx;
	border-radius: 12rpx;
	font-size: 32rpx;
	margin-top: 48rpx;
}

.submit-btn[disabled] {
	background: #c0c4cc;
	opacity: 0.7;
}
</style>