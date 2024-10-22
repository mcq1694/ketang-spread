<!--
* @description  参数1
* @fileName  scanlogin
* @author chengwei
* @date 2023-03-29 15:38:27
-->

<script lang="ts" setup>
  import { ref } from 'vue';
  import PayButton from './components/PayButton/PayButton.vue';
  import RedPack from './components/RedPack/RedPack.vue';
  const cArr = Array.from(
    { length: 10 },
    (_, index) => `https://ttmini.yizhiwechat.com/keTang/kt-spread/curriculum/c-${index + 1}.png`,
  );
  function previewImage(src) {
    console.log('previewImage', src);
    uni.previewImage({
      urls: cArr,
      current: src,
    });
  }
</script>

<template>
  <kt-layout :header="{ title: '经络瑜伽调养营' }" height-mode="fixed">
    <view class="flex flex-col w-full h-full">
      <view class="flex-1 w-screen overflow-hidden">
        <scroll-view class="w-full h-full" scroll-y>
          <view>
            <image
              class="w-full"
              v-for="(item, index) in cArr"
              :key="index"
              :src="item"
              mode="widthFix"
              @click="previewImage(item)"
            />
          </view>
        </scroll-view>
      </view>
      <PayButton />
    </view>
    <!-- <RedPack /> -->
  </kt-layout>
</template>
