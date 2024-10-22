<script setup lang="ts">
  import { getCurrentInstance, ref } from 'vue';
  import H5VideoPlay from './components/H5VideoPlay.vue';
  import WxPlayRate from './components/WxPlayRate.vue';
  defineProps({
    // 资源路径
    mediaUrl: {
      default: '',
      type: String,
    },
    // 视频封面
    coverUrl: {
      default: '',
      type: String,
    },
    // 视频角度
    direction: {
      default: 0,
      type: Number,
    },
    // 开启版权横幅
    authorName: {
      default: '',
      type: String,
    },
    needRecord: {
      default: true,
      type: Boolean,
    },
    // 是否显示禁止
    showDisableRecord: {
      default: false,
      type: Boolean,
    },
  });
  const emit = defineEmits([
    'end',
    'loadedmetadata',
    'onVideoEnded',
    'onVideoPause',
    'onTimeUpdate',
    'onRateChange',
  ]);
  const videoCtx: any = ref(null);

  const instance = getCurrentInstance();
  const playRate = ref(1.0);
  function onVideoPlay() {
    // #ifdef MP-WEIXIN
    if (!videoCtx.value) {
      videoCtx.value = uni.createVideoContext('userVideo', instance);
    }
    videoCtx.value.playbackRate(playRate.value);
    // #endif
  }
  function onVideoPause() {
    emit('onVideoPause');
  }

  function onVideoError(e) {
    const param = {
      msg: `视频播放错误;info:${e}`,
      api_url: `errorHandler${JSON.stringify(e)}`,
      status_msg: 'video',
    };
  }
  function onVideoEnded() {
    emit('onVideoEnded');
  }
  function loadedmetadata() {
    emit('loadedmetadata');
  }
  function onRateChange(rate) {
    // #ifdef MP-TOUTIAO
    rate = rate.detail.playbackRate;
    // #endif
    emit('onRateChange', rate);
  }
  function changeRateNum(rate) {
    if (!videoCtx.value) {
      videoCtx.value = uni.createVideoContext('userVideo', instance);
    }
    videoCtx.value.playbackRate(rate);
    playRate.value = rate;
    emit('onRateChange', rate);
  }
</script>

<template>
  <view class="relative bg-[#000] w-full h-full">
    <!-- #ifdef H5 -->
    <H5VideoPlay
      class="relative"
      v-if="mediaUrl"
      ref="videoCtx"
      :src="mediaUrl"
      :direction="direction === 0 ? 0 : -90"
      @pause="onVideoPause"
      @error="onVideoError"
      @ended="onVideoEnded"
      @play="onVideoPlay"
      @ratechange="onRateChange"
      :autoplay="true"
      :poster="coverUrl"
      @loadedmetadata="loadedmetadata"
    />
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <video
      class="relative w-full h-full bg-[#000]"
      :autoplay="true"
      v-if="mediaUrl"
      :poster="coverUrl"
      id="userVideo"
      style="position: relative"
      :src="mediaUrl"
      object-fit="contain"
      :show-playback-rate-btn="true"
      :controls="true"
      :show-play-btn="true"
      :vslide-gesture="true"
      :enable-progress-gesture="true"
      :enable-play-gesture="true"
      :show-mute-btn="true"
      :enable-play-in-background="true"
      :direction="direction === 0 ? 0 : -90"
      :show-casting-button="true"
      @pause="onVideoPause"
      @error="onVideoError"
      @ended="onVideoEnded"
      @play="onVideoPlay"
      @loadedmetadata="loadedmetadata"
      @playbackratechange="onRateChange"
    >
    </video>
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <WxPlayRate @change-rate="changeRateNum" :play-rate="playRate" />
    <!-- #endif -->
  </view>
</template>

<style scoped lang="scss">
  @keyframes lamp {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(-100%);
    }
  }
</style>
