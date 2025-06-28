<template>
  <view class="map-container">
    <!-- 搜索框 -->
    <view class="search-container">
      <view class="search-box">
        <input 
          v-model="searchAddress" 
          placeholder="搜索地点"
          class="search-input"
          @confirm="searchLocation"
        />
        <button class="search-btn" @click="searchLocation">搜索</button>
      </view>
    </view>

    <map 
      id="wzMap"
      :latitude="latitude"
      :longitude="longitude"
      :scale="13"
      style="width: 100%; height: 80vh"
      enable-traffic
      :markers="markers"
      @tap="handleMapTap"
      @poi-tap="handleMapTap">
    </map>
    
    <button class="confirm-btn" @click="confirmPosition">确认标点位置</button>
  </view>
</template>

<script>
import LoadingComponent from '@/components/LoadingComponent.vue'
export default {
  data() {
    return {
      // 地图中心点（温州南站附近）
      latitude: 28.007675,
      longitude: 120.655421,
      markers: [],
      targetMarker: {},
      
      // 搜索相关
      searchAddress: ''
    }
  },
  onLoad(options) {
    // 接收传递的地址参数
    if (options.address) {
      this.searchAddress = decodeURIComponent(options.address);
      // 延迟一下再进行搜索，确保页面完全加载
      setTimeout(() => {
        this.searchLocation();
      }, 1500);
    }
  },
  onShow() {
    this.fetchCenter()
  },
  methods: {
    fetchCenter() {
      const centerdata = uni.getStorageSync('TempCenter_data');
      if (centerdata != '') {
        this.latitude = centerdata.latitude;
        this.longitude = centerdata.longitude;
        
        // 如果有之前保存的位置，显示标记点
        this.markers = [{
          id: 1,
          latitude: centerdata.latitude,
          longitude: centerdata.longitude,
          width: 20,
          height: 30
        }];
      }
    },
    

    
    // 搜索地点功能
    async searchLocation() {
      if (!this.searchAddress.trim()) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none'
        });
        return;
      }
      
      try {
        uni.showLoading({ title: '搜索中...' });
        
        // 使用腾讯地图WebService API进行地点搜索
        const response = await this.callTencentMapAPI(this.searchAddress);
        
        if (response && response.result && response.result.location) {
          // 搜索结果
          const latitude = response.result.location.lat;
          const longitude = response.result.location.lng;
          
          // 更新地图中心点
          this.latitude = latitude;
          this.longitude = longitude;
          
          // 在地图上添加标记点
          this.markers = [{
            id: 1,
            latitude: latitude,
            longitude: longitude,
            width: 20,
            height: 30,
          }];
          
                      // 显示成功提示
            uni.showToast({
              title: '定位成功',
              icon: 'success',
              duration: 1000
            });
        } else {
          uni.showToast({
            title: '未找到相关地点',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('搜索失败:', error);
        uni.showToast({
          title: '搜索失败，请重试',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 调用腾讯地图API
    async callTencentMapAPI(searchAddress) {
      return new Promise((resolve, reject) => {
        // 拼接上温州市,更加精确
        const fullSearchAddress = '温州市' + searchAddress;
        // 腾讯地图API密钥
        const apiKey = 'TMGBZ-76P67-K5PXR-HEL5E-ZHKO2-7TB4T';
        const url = `https://apis.map.qq.com/ws/geocoder/v1/`;
        
        const requestData = {
          key: apiKey,
          address: fullSearchAddress
        };
        
        uni.request({
          url: url,
          data: requestData,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200 && res.data.status === 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.data.message || '搜索失败'));
            }
          },
          fail: (err) => {
            reject(new Error('网络请求失败'));
          }
        });
      });
    },
    

    
    confirmPosition() {
      if (this.markers.length > 0) {
        uni.setStorageSync('TempCenter_data', this.markers[0]);
        uni.navigateBack();
      } else {
        uni.showToast({
          title: '请先选择位置',
          icon: 'none'
        });
      }
    },
    
    // 标记点点击事件
    handleMapTap(e) {
      const markers = [{
        id: 1,
        latitude: e.detail.latitude,
        longitude: e.detail.longitude,
        width: 20,
        height: 30
      }]
      this.markers = markers;
    },
  }
}
</script>

<style>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* 搜索容器样式 */
.search-container {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  right: 20rpx;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  padding: 20rpx;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 80rpx;
  padding: 0 24rpx 0 60rpx;
  border: 2rpx solid #e0e3e6;
  border-radius: 12rpx;
  font-size: 28rpx;
  background-image: url('/static/other_icons/search.png');
  background-repeat: no-repeat;
  background-position: 20rpx center;
  background-size: 32rpx 32rpx;
}

.search-btn {
  margin-left: 20rpx;
  padding: 0 24rpx;
  background-color: #1890FF;
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}


.search-input:focus {
  border-color: #1890FF;
}

.confirm-btn {
  margin: 30rpx 50rpx;
  background-color: #1890FF;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 5rpx 20rpx;
  text-align: center;
}
</style>