<template>
  <kt-dialog-base>
    <view
      class="flex items-center justify-center w-screen h-screen bg-[#000] z-top pointer-events-none"
      @click.prevent.stop
      @touchstart.prevent.stop
      @touchmove.prevent.stop
    >
      <view class="text-[#fff] whitespace-pre-line font-bold text-xl px-15"
        >该课程不允许录屏，关闭录屏后可正常观看</view
      >
    </view>
  </kt-dialog-base>
</template>
