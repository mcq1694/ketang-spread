<script setup lang="ts">
  import { ref } from 'vue';
  import CustomTime from '../CustomTime/CustomTime.vue';
  const btn_beat = ref(true);
  console.log('咱就是一个红包');
  setTimeout(() => {
    btn_beat.value = false;
  }, 200);
  function openRed() {
    console.log('openRed');
    btn_beat.value = false;
  }
  //   :class="[btn_beat ? '' : 'RedPack_ani']"
</script>
<template>
  <kt-dialog-base aniName="animate_fadeInUpBig">
    <view
      :class="[btn_beat ? '' : 'RedPack_ani']"
      style="background: linear-gradient(180deg, #fb6a2e 0%, #e62520 100%)"
      class="w-322 h-372 bg-[red] rounded relative RedPack overflow-hidden"
    >
      <view
        class="w-295 h-305 bg-[#FEFBF0] rounded-xl mx-auto pt-32"
        :class="[btn_beat ? '' : 'c_box_ani']"
      >
        <view :class="[btn_beat ? '' : 'c_box_c_ani']">
          <view class="text-[#FF4B47] flex justify-center font-semibold text-3xl"
            >恭喜获得学习优惠</view
          >
          <view class="flex items-baseline justify-center price">
            99
            <view class="cp">元</view>
          </view>
        </view>
      </view>
      <view class="absolute top-0 left-0 w-322 h-250 r_box" :class="[btn_beat ? '' : 'r_box_ani']">
        <image
          class="w-full h-full"
          src="https://ttmini.yizhiwechat.com/keTang/kt-spread/red/red-t.png"
          mode="scaleToFill"
        />
        <view class="absolute top-0 left-0 flex flex-col items-center w-full h-full">
          <view class="flex justify-center mt-12 t"> 姐妹专享红包 </view>
          <image
            class="w-115 h-115"
            src="https://ttmini.yizhiwechat.com/keTang/kt-spread/red/avatar.png"
            mode="scaleToFill"
          />
          <view class="mt-13 text-[#FFF] text-lg font-semibold">别让身体束缚了你的光芒</view>
        </view>
      </view>
      <image
        class="absolute bottom-0 left-0 w-322 h-160"
        src="https://ttmini.yizhiwechat.com/keTang/kt-spread/red/red-b.png"
        mode="scaleToFill"
      />
      <image
        @click="openRed"
        class="absolute w-95 h-95 left-113 top-234 btn"
        src="https://ttmini.yizhiwechat.com/keTang/kt-spread/red/reb-btn.png"
        mode="scaleToFill"
        :class="[btn_beat ? 'open_btn_ani' : 'open_btn_ani_close']"
      />
    </view>
  </kt-dialog-base>
</template>

<style scoped lang="scss">
  .RedPack {
    transform: scale(1, 1);
    &_ani {
      //   animation: slide-out-bck-bottom 0.7s 1.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
    }

    .r_box {
      transform-origin: top left;
    }
    .r_box_ani {
      animation: slide-out-tl 0.8s 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
    }
    .c_box_ani {
      animation: bounce-bottom 0.7s 0.5s both;
    }
    .c_box_c_ani {
      animation: pulsate-fwd 0.7s 0.4s both;
    }
    .btn {
      transition: transform 0.15s linear;
    }
    .open_btn_ani_close {
      transform: scale(0);
    }
    .open_btn_ani {
      transform: scale(1);
      animation: heartbeat 1.5s ease-in-out infinite both;
    }
    @keyframes heartbeat {
      0% {
        transform: scale(1);
        transform-origin: center center;
        animation-timing-function: ease-out;
      }

      10% {
        transform: scale(0.91);
        animation-timing-function: ease-in;
      }

      17% {
        transform: scale(0.98);
        animation-timing-function: ease-out;
      }

      33% {
        transform: scale(0.87);
        animation-timing-function: ease-in;
      }

      45% {
        transform: scale(1);
        animation-timing-function: ease-out;
      }
    }
    .t {
      background: linear-gradient(268deg, #ffe24c 0.21%, #ffd747 99.79%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Alibaba PuHuiTi 3.0';
      font-size: 64rpx;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 8rpx;
    }
    .price {
      font-family: 'Alibaba PuHuiTi 3.0';
      font-size: 192rpx;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      background: linear-gradient(180deg, #fa7739 0%, #f95830 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      .cp {
        font-size: 40rpx;
      }
    }
  }

  @-webkit-keyframes slide-out-tl {
    0% {
      -webkit-transform: translateY(0) translateX(0);
      transform: translateY(0) translateX(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-1000px) translateX(-1000px);
      transform: translateY(-1000px) translateX(-1000px);
      opacity: 0;
    }
  }
  @keyframes slide-out-tl {
    0% {
      -webkit-transform: translateY(0) translateX(0);
      transform: translateY(0) translateX(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-1000px) translateX(-1000px);
      transform: translateY(-1000px) translateX(0);
      opacity: 0;
    }
  }

  @keyframes bounce-bottom {
    0% {
      transform: translateY(40px);
    }
    100% {
      transform: translateY(20px);
    }
  }

  @keyframes pulsate-fwd {
    0% {
      transform: scale(0.5);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes slide-out-bck-bottom {
    0% {
      -webkit-transform: translateZ(0) translateY(0);
      transform: translateZ(0) translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateZ(-1100px) translateY(1000px);
      transform: translateZ(-1100px) translateY(1000px);
      opacity: 0;
    }
  }
</style>
