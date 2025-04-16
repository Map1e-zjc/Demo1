<template>
  <view class="map-container">
    <map 
      id="myMap"
      style="width: 100%; height: 80vh;"
      :latitude="latitude"
      :longitude="longitude"
      :scale="scale"
      :markers="markers"
      :polygons="polygons"
      include-points="{{polygons[0].points}}"
      show-location
      bindregionchange="onRegionChange"
	  @tap="handleMapTap" 
    ></map>
  </view>
    <button @click="goToProductDetail" class="btn">快捷操作</button>
</template>

<script>
export default {
  data() {
    // 鹿城区与瓯海区合并后的边界坐标（示例值）
    const minLat = 27.900, maxLat = 28.050;
    const minLng = 120.600, maxLng = 120.800;

    return {
      latitude: (minLat + maxLat) / 2, // 初始中心点
      longitude: (minLng + maxLng) / 2,
      scale: 12,
      markers: [], // 原有标记点配置
      polygons: [{
        points: [
          
        ],
        strokeWidth: 4,
        strokeColor: "#007AFF",
        fillColor: "#007AFF22"
      }]
    }
  },
  methods: {
    onRegionChange(e) {
      if (e.type === 'end') {
        const mapCtx = uni.createMapContext('myMap');
        mapCtx.getCenterLocation({
          success: (res) => {
            const { minLat, maxLat, minLng, maxLng } = this.data.polygons[0];
            if (res.latitude < minLat || res.latitude > maxLat || 
                res.longitude < minLng || res.longitude > maxLng) {
              mapCtx.moveToLocation({
                latitude: (minLat + maxLat) / 2,
                longitude: (minLng + maxLng) / 2
              });
            }
          }
        });
      }
    },
	goToProductDetail() {
		uni.navigateTo({
			url:'/pages/Fasttest/Fasttest'
		})
	}
  }
}
</script>
<style>
.btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>