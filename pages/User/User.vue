<template>
	<view class="container">
		<view class="goto" @click="goSomewhere1">
			跳转1
		</view>
		<view class="goto" @click="goSomewhere2">
			跳转2
		</view>
		<view class="about" @click="goAboutUs">
			关于我们
		</view>
	</view>
	
</template>

<script>
export default {
  data() {
    return {
		
	}
  },
  methods: {
	goSomewhere1() {
		uni.navigateTo({
			url: "/pages/User/AboutUs"
		})
	},
	goSomewhere2() {
		uni.navigateTo({
			url: "/pages/User/Login"
		})
	},
	goAboutUs() {
		uni.navigateTo({
			url: "/pages/User/AboutUs"
		})
	}
  }
}
</script>

<style scoped>
.container {
	padding: 0 20rpx;
}	
	
.goto {
	padding: 50rpx;
	text-align: center;
	font-size: 40rpx;
	border: 1px solid #e5e5e5 ;
	background-color: #eee;
	margin: 10rpx 0;
}
.about {
	padding: 50rpx;
	text-align: center;
	font-size: 40rpx;
	border: 1px solid #e5e5e5 ;
	background-color: #eee;
}
</style>