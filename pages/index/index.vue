<template>
  <view class="map-container">
    <LoadingComponent 
      :isLoading="isLoading"
      text="地图加载中"
      color="#2979FF"
      :size="40"
    />
    <map 
      id="wzMap"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="13"
      style="width: 100%; height: 100vh"
      enable-traffic
      @markertap="handleMarkerTap"
      @tap="handleMapTap">
    </map>

    <!-- 弹窗结构（直接显示/隐藏） -->
    <view class="popup-mask" v-show="showPopup" @touchmove.prevent @tap="closePopup">
      <view class="popup-container">
        <view class="popup-content">
          <view class="title-row">
            <image class="location-icon" src="/static/other_icons/location-icon.png"></image>
            <text class="project-title">{{ targetMarker?.title }}</text>
          </view>
          
          <view class="info-row">
            <text class="info-label">地址：</text>
            <text class="info-text">{{ targetMarker?.address }}</text>
          </view>
          
          <view class="info-row">
            <text class="info-label">招租面积：</text>
            <text class="info-text">{{ targetMarker?.leasingArea }} m²</text>
          </view>
          
          <button class="detail-btn" @tap="navigateToDetail">查看项目详情</button>
        </view>
      </view>
    </view>
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
      isLoading:true,
      showPopup:false,
      targetMarker:{},
      // 标记点数据（瓯海区 & 鹿城区）
      markers: []
    }
  },
  components: {
    LoadingComponent
  },
  onLoad()
  {
    this.fetchData()
  },
  onShow()
  {
     this.fetchCenter()
  },
  methods: {
    fetchCenter()
    {
      const centerdata = uni.getStorageSync('Center_data');
      if(centerdata != '')
      {
        this.latitude = centerdata.latitude;
        this.longitude = centerdata.longitude;
        uni.removeStorageSync('Center_data')
      }
    },
    async fetchData()
    {
      try {
        // 调用云函数获取项目详情
        const res = await uniCloud.callFunction({
          name: 'db-query',
          data: {
            collectionName: 'Project_data',
            query: {status: 'published'}
          }
        });
        //console.log(res.result)
        if(res.result && res.result.code === 200 && res.result.data && res.result.data)
        {
          const projectData = res.result.data.data;
          for (const project of projectData)
          {
            const markersElement = {
              width: 24,
              height: 34,
              callout:
              {
                color:"#FFFFFF",
                bgColor:"#1890FF",
                borderRadius:4,
                padding:8,
                display:"ALWAYS"
              }
            };
            markersElement.id = this.markers.length;
            markersElement._id = project._id;
            markersElement.title = project.name;
            markersElement.callout.content = project.name;
            markersElement.leasingArea = project.LeasingArea;
            markersElement.address = project.address;
            const latitude = project.accuratePosition.latitude;
            const longitude =  project.accuratePosition.longitude;
            if(latitude && latitude != 0 && latitude >= -90 && latitude <= 90)
              markersElement.latitude = project.accuratePosition.latitude;
            else console.error('数据库纬度数据加载异常:');
            if(longitude && longitude != 0 && longitude >= -180 && longitude <= 180)
              markersElement.longitude = project.accuratePosition.longitude;
            else console.error('数据库经度数据加载异常:');
            this.markers.push(markersElement)
            //console.log(markersElement)
          }
        }
        else
        {
          console.error('数据库查询失败:', err);
        }
        this.isLoading = false;
      } catch (err) {
        console.error('加载项目详情失败:', err);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
        this.isLoading = false;
      }
    },
    // 标记点点击事件
    handleMarkerTap(e) {
      const targetMarker = this.markers.find(item => item.id === e.markerId)
      if (targetMarker){
        this.targetMarker = targetMarker;
        console.log('找到标记点:', targetMarker.title);
        this.showPopup = true;
       }
      else console.error('未找到对应标记点', e.markerId)
    },
    closePopup() {
      this.showPopup = false;
    },
    navigateToDetail() {
      if (this.targetMarker) {
        uni.navigateTo({
          url: `/pages/Project/ProjectDetail?id=${this.targetMarker._id}`
        });
        this.closePopup();
      }
    }
  }
}
</script>

<style>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.popup-container {
  width: 100%;
  padding: 40rpx;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
}

.popup-content {
  display: flex;
  flex-direction: column;
}

.title-row {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.location-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.project-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.info-row {
  margin-bottom: 24rpx;
  display: flex;
  align-items: flex-start;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
  flex-shrink: 0;
}

.info-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
}

/* 按钮样式 */
.detail-btn {
  margin-top: 30rpx;
  background-color: #1890FF;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding:5rpx 20rpx;
  text-align: center;
}
</style>