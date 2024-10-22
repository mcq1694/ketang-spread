<!--
* @description  弹窗基准组件
* @fileName  kt-dialoag-base
* @author machaunqi
* @date 2023-07-03 14:15:06
-->
<script setup lang="ts">
  import { computed } from 'vue';
  import { isEmpty } from '/@/utils';
  import { dialoagProps } from './dialogProps';
  const props = defineProps(dialoagProps);
  const emits = defineEmits(['maskHandel']);
  const anicss = computed(() => {
    const strArr = [
      `${props.aniName === 'animate_bounceIn' ? 'zoom-ani' : props.aniName}`,
      'absolute',
      'animate_duration-300',
    ];
    if (props.fixedX !== 'center') {
      strArr.push(`${props.fixedX}-0`);
    }
    if (props.fixedY !== 'center') {
      strArr.push(`${props.fixedY}-0`);
    }
    if (!isEmpty(props.contentStyle)) {
      strArr.push(...props.contentStyle.split(','));
    }
    return strArr;
  });
</script>

<template>
  <view
    v-if="anicss"
    class="fixed top-0 bottom-0 left-0 flex items-center justify-center w-screen h-screen z-top"
  >
    <view
      v-if="mask"
      class="w-full h-full bg-black mask bg-opacity-80"
      @click="emits('maskHandel')"
    />
    <view :class="anicss">
      <slot></slot>
    </view>
  </view>
</template>

<style scoped>
  .zoom-ani {
    animation: zoom 0.25s cubic-bezier(0.14, 0, 0.55, 1.21);
  }

  @keyframes zoom {
    0% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
