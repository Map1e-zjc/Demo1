<template>
  <view class="map-container">
    <map 
      id="wzMap"
      :latitude="28.007675"
      :longitude="120.655421"
      :markers="markers"
      :scale="13"
      style="width: 100%; height: 100vh"
      show-location
      enable-traffic
      @markertap="handleMarkerTap">
    </map>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 地图中心点（温州南站附近）
      center: {
        latitude: 28.007675,
        longitude: 120.655421
      },
      
      // 标记点数据（瓯海区 & 鹿城区）
      markers: [
        {
          id: 1,
          title: "瓯海区政府",
          latitude: 28.01332,
          longitude: 120.66874,
          width: 24,    // 必须参数
          height: 34,   // 必须参数
          callout: {
            content: "瓯海区政府",  // 常显信息窗
            color: "#FFFFFF",
            bgColor: "#1890FF",
            borderRadius: 4,
            padding: 8,
            display: "ALWAYS"
          }
        },
        {
          id: 2,
          title: "鹿城区政府",
          latitude: 28.01085,
          longitude: 120.70321,
          width: 24,
          height: 34,
          callout: {
            content: "鹿城区政府",
			color: "#FFFFFF",
            bgColor: "#52C41A",
			borderRadius: 4,
			padding: 8,
            display: "ALWAYS"
          }
        },
        // 其他标记点...
        {
          id: 15,
          title: "温州南站",
          latitude: 27.987397,
          longitude: 120.694927,
          width: 24,
          height: 34,
          callout: {
            content: "温州南站（高铁站）",
			color: "#FFFFFF",
            bgColor: "#FA8C16",
			borderRadius: 4,
			padding: 8,
            display: "ALWAYS"
          }
        }
      ]
    }
  },
  onLoad()
  {
	  
  },
  methods: {
    // 标记点点击事件
    handleMarkerTap(e) {
      console.log('点击标记:', e.markerId)
    }
  }
}
</script>

<style>
.map-container {
  position: relative;
}
</style>