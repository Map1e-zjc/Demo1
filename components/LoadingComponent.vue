<!-- components/LoadingComponent.vue -->
<template>
  <view v-if="isLoading" class="loading-wrapper">
    <view class="loading-box">
      <view 
        class="loading-animation"
        :style="{
          borderColor: color,
          borderTopColor: color,
          width: size + 'rpx',
          height: size + 'rpx'
        }"
      ></view>
      <text class="loading-text" :style="{ color: color }">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LoadingComponent',
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '加载中...'
    },
    color: {
      type: String,
      default: '#007AFF'
    },
    size: {
      type: Number,
      default: 40
    }
  }
}
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-animation {
  border: 16rpx solid #f3f3f3;
  border-top: 10rpx solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 50rpx;
  letter-spacing: 3rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>