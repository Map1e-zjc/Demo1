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
import LoadingComponent from '@/components/LoadingComponent.vue'
export default {
  data() {
    return {
      // 地图中心点（温州南站附近）
      center: {
        latitude: 28.007675,
        longitude: 120.655421
      },
      isLoading:true,
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
  methods: {
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
			console.log(res.result)
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
					const latitude = project.accuratePosition.latitude;
					const longitude =  project.accuratePosition.longitude;
					if(latitude && latitude != 0 && latitude >= -90 && latitude <= 90)
						markersElement.latitude = project.accuratePosition.latitude;
					else console.error('数据库纬度数据加载异常:', err);
					if(longitude && longitude != 0 && longitude >= -180 && longitude <= 180)
						markersElement.longitude = project.accuratePosition.longitude;
					else console.error('数据库经度数据加载异常:', err);
					this.markers.push(markersElement)
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
	  const targetMarker = this.markers.find(
	  item => item.id === e.markerId)
	  if (targetMarker) console.log('找到标记点:', targetMarker.title)
	  else console.error('未找到对应标记点', e.markerId)
	  uni.showModal({
	  	title: '',
	  	  content: '查看' + targetMarker.title +  '项目细节？',
	  	  success: (res) => {
	  	    if (res.confirm) {
	  	      uni.navigateTo({
	  	      	url: `/pages/Project/ProjectDetail?id=${targetMarker._id}`
	  	      });
	  	    } else if (res.cancel) {
	  	      return;
	  	    }
	  	  }
	  })
    }
  }
}
</script>

<style>
.map-container {
  position: relative;
}
</style>