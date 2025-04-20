<script>
	export default {
		globalData: {
			imageCache: {}
		},
		onLaunch: function() {
			console.log('App Launch');
			// 初始化加载图片缓存
			const cachedImages = uni.getStorageSync('project_image_cache');
			if (cachedImages) {
				this.globalData.imageCache = cachedImages;
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide');
			// 应用隐藏时保存图片缓存
			uni.setStorageSync('project_image_cache', this.globalData.imageCache);
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
