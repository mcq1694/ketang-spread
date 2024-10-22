<script setup lang="ts">
  import { ref } from 'vue';
  import { rateArr } from './props';
  const props = defineProps({
    playRate: {
      default: 1.0,
      type: Number,
    },
  });
  const emit = defineEmits(['changeRate']);
  const showRateBox = ref(false);
  function changeRateNum(rate) {
    if (rate !== props.playRate) {
      emit('changeRate', rate);
      showRateBox.value = false;
    }
  }
</script>

<template>
  <view
    class="w-fit bg-[rgb(0,0,0,.5)] backdrop-blur-sm rounded-full px-10 py-6 text-[#ced0da] text-xs font-semibold absolute right-12 top-1/2 transform -translate-y-1/2 z-10"
    @click="showRateBox = true"
  >
    {{ `${playRate}x` || '倍速' }}
  </view>
  <view class="absolute top-0 left-0 w-full h-full" v-if="showRateBox">
    <view class="absolute top-0 left-0 z-10 w-full h-full" @click="showRateBox = false" />
    <view class="video_play_rate_box">
      <view
        class="video_play_rate"
        :class="{ 'rate-s': item === playRate }"
        v-for="item in rateArr"
        @click="changeRateNum(item)"
        :key="item"
      >
        {{ item }}x
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
  .video_play_rate_box {
    @apply h-full w-120 absolute backdrop-blur-sm top-0 flex flex-col justify-center items-center z-20 right-0 bg-[rgb(47,47,47,.8)];

    .video_play_rate {
      @apply bg-[rgb(0,0,0,.1)] border-2 border-[#ced0da] backdrop-blur-sm rounded-full flex justify-center items-center text-xs w-44 h-22 mb-12 font-semibold text-[#fff] animate_fadeInRight animate_duration-300;
    }

    .rate-s {
      @apply border-[#f6955d] text-[#f6955d];
    }
  }
</style>
