<template>
  <view class="form-container">
    <text class="title">项目信息录入</text>

    <view class="form-content">
      <!-- 基础信息 -->
      <view class="form-section">
        <input v-model="form.name" placeholder="项目名称*" class="input-field" />
        <input v-model="form.street" placeholder="街道名称*" class="input-field" />
        <input v-model="form.address" placeholder="详细地址*" class="input-field" />
        <input v-model="form.district" placeholder="所属城区*" class="input-field" />
        <view class="coord-group">
          <input 
            v-model="form.accuratePosition.longitude" 
            type="number" 
            placeholder="经度*" 
            class="input-field half-width" 
          />
          <input 
            v-model="form.accuratePosition.latitude" 
            type="number" 
            placeholder="纬度*" 
            class="input-field half-width" 
          />
        </view>
        <textarea 
          v-model="form.description" 
          placeholder="项目描述*" 
          class="input-field textarea" 
          auto-height
        />
      </view>

      <!-- 面积信息 -->
      <view class="form-section">
        <input 
          v-model="form.LeasingArea" 
          type="number" 
          placeholder="招租面积(㎡)*" 
          class="input-field" 
        />
        <input 
          v-model="form.OccupancyArea" 
          type="number" 
          placeholder="入驻面积(㎡)*" 
          class="input-field" 
        />
      </view>

      <!-- 图片上传 -->
      <view class="form-section">
        <view class="upload-wrap" @click="uploadImage()">
          <text class="upload-text">{{ form.image ? '已上传' : '点击上传项目照片*' }}</text>
        </view>
      </view>
      <!-- 预览按钮 -->
	  <button
	    class="preview-btn" 
	    :disabled="!isFormValid" 
	    @click="ToPreview()"
	  >
	  预览项目页面
	  </button>
	  <!-- 提交按钮 -->
      <button 
        class="submit-btn" 
        :disabled="!isFormValid" 
        @click="handleSubmit()"
      >
        提交项目
      </button>
    </view>
  </view>
</template>

<script>
import uploadImage from '@/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/functions/upLoadImage.js';
export default {
  data() {
    return {
      form: {
        name: '',
        street: '',
        address: '',
        district: '',
        accuratePosition: {
          longitude: null,
          latitude: null
        },
        description: '',
        LeasingArea: null,
        OccupancyArea: null,
        status: 'published',
        investmentStatus: '招租中',
        image: '',
        companies: [],
        rentalDetails: []
      }
    }
  },
  computed: {
    isFormValid() {
      return [
        this.form.name,
        this.form.street,
        this.form.address,
        this.form.district,
        this.form.accuratePosition.longitude,
        this.form.accuratePosition.latitude,
        this.form.description,
        this.form.LeasingArea,
        this.form.OccupancyArea,
        this.form.image
      ].every(field => !!field)
    }
  },
  methods: {
    async uploadImage() {
      try {
        uni.showLoading({ title: '上传中...' });
        
        // 调用云存储上传（确保返回FileID）
        const { fileID } = await uniCloud.uploadFile({
          filePath: res.tempFilePaths[0],
          cloudPath: `project_images/${Date.now()}.jpg`
        });
    
        // 立即获取临时URL用于预览
        const { tempFileURL } = await uniCloud.getTempFileURL({ 
          fileList: [fileID] 
        });
    
        this.form.image = tempFileURL; // 存储临时URL
        uni.setStorageSync('Preview_data', this.form);
        
        uni.showToast({ title: '上传成功' });
      } catch (err) {
        console.error('上传失败:', err);
        uni.showToast({ title: '上传失败' });
      } finally {
        uni.hideLoading();
      }
    },
	ToPreview()
	{
		uni.setStorageSync('Preview_data',this.form);
		uni.navigateTo({
			url:"/pages/Admin/PreviewProject"
		})
	},
    async handleSubmit() {
      try {
        const res = await uniCloud.callFunction({
          name: 'db-add',
          data: {
            collectionName: 'Project_data',
            data: this.form
          }
        })
		uni.removeStorageSync('Preview_data')
        if (res.result.code === 200) {
          wx.showToast({ title: '提交成功', duration: 1500 })
          setTimeout(() => wx.navigateBack(), 1500)
        } else {
          throw new Error(res.result.message)
        }
      } catch (error) {
        wx.showToast({ title: `提交失败: ${error.message}`, icon: 'none' })
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
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
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

.coord-group {
  display: flex;
  gap: 20rpx;
}

.half-width {
  flex: 1;
}

.textarea {
  height: 200rpx;
  padding: 24rpx;
  line-height: 1.6;
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

.submit-btn, .preview-btn {
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