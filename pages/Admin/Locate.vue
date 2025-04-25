<template>
  <view class="map-container">
    <map 
      id="wzMap"
      :latitude="latitude"
      :longitude="longitude"
      :scale="13"
      style="width: 100%; height: 80vh"
      enable-traffic
	  :markers="markers"
      @tap="handleMapTap"
	  @poi-tap="handleMapTap" >
    </map>
	<button class="confirm-btn" @click="confirmPosition" >确认标点位置</button>
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
	  markers:[],
      targetMarker:{},
    }
  },
  onShow()
  {
     this.fetchCenter()
  },
  methods: {
    fetchCenter()
    {
      const centerdata = uni.getStorageSync('TempCenter_data');
      if(centerdata != '')
      {
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
	confirmPosition()
	{
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
      //console.log(e.detail)
	  const markers = [{
		id:1,
		latitude:e.detail.latitude,
		longitude:e.detail.longitude,
        width: 20,  // 添加标记点宽度
        height: 30  // 添加标记点高度
	  }]
	  this.markers= markers;
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

.confirm-btn {
  margin: 30rpx 50rpx;
  background-color: #1890FF;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding:5rpx 20rpx;
  text-align: center;
}
</style>