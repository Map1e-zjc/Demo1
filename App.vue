<script>
	export default {
		globalData: 
		{
		    isLogin:false,
		},
		onLaunch: function() {
			const app = getApp();
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
