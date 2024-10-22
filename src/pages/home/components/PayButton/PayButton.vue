<script setup lang="ts">
  import TimeItem from '../CustomTime/components/TimeItem.vue';
  import CustomTime from '../CustomTime/CustomTime.vue';
</script>
<template>
  <view>
    <view>
      <view
        class="w-full bg-[#FFFBEA] px-12 py-9 border-b border-[#7C5139] flex items-center justify-between"
      >
        <view class="flex items-center">
          <CustomTime />

          <view class="text-[#777] text-md ml-12">后恢复1000</view>
        </view>
        <view class="h-20 bg-[#EFB4A7] rounded-full flex items-center">
          <view
            class="h-full rounded-full bg-[#CC4D31] text-xs text-[#fff] pl-12 pr-5 flex items-center"
            >名额仅剩：</view
          >
          <view class="flex items-center h-full pl-5 pr-9 font-medium text-xl text-[#fff]">21</view>
        </view>
      </view>
    </view>
    <view class="w-full bg-[#FFFBEA] px-12 py-9">
      <view
        class="w-full rounded bg-[#CC4D31] py-12 flex justify-center items-center text-[#FFF] text-28 font-medium"
        >￥1.00 立即领取</view
      >
      <kt-safe />
    </view>
  </view>
</template>

<style scoped></style>
