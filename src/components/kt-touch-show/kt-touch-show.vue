<script lang="ts" setup name="KtTouchShow">
  import { ref } from 'vue';
  // import { onShow } from '@dcloudio/uni-app';
  const props = defineProps({
    /**
     * @description 点击次数，在多少次点击后出现隐藏信息
     * @param {number} count
     * @default 6
     */
    count: {
      type: Number,
      default: 6,
    },
  });
  const emits = defineEmits(['change']);
  const visible = ref(false);
  let timer: ReturnType<typeof setTimeout>;
  let countValue = 0;

  function clickHander() {
    if (visible.value) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    countValue++;
    if (countValue >= props.count) {
      visible.value = true;
      emits('change', visible.value);
    }
    timer = setTimeout(() => {
      countValue = 0;
    }, 500);

    if (countValue >= Math.floor(props.count / 2)) {
      uni.showToast({
        icon: 'none',
        title: `You still need to click ${props.count - countValue} times`,
      });
    }
  }
</script>

<template>
  <view @click="clickHander">
    <slot v-if="visible" name="info" :hander="clickHander"></slot>
    <slot name="target"></slot>

    <slot :hander="clickHander"></slot>
  </view>
</template>
