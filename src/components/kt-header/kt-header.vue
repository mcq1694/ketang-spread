<!--
* @description  公共的导航栏Header组件
* @fileName  kt-header
* @author chengwei
* @date 2022-11-08 15:26:43
-->
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useAppStoreWithOut } from '/@/store';
  import { useRoute } from '/@/hooks/core';
  import { addUnit } from '/@/utils';
  import { props } from './props';

  export default defineComponent({
    name: 'Ktheader',
    props,
    emits: {
      /**
       * @description 获取完成顶部header组件高度时的回调
       * @param {number} height header导航栏高度，单位px
       */
      loaded: (height: number) => typeof height === 'number',
    },
    setup(props, { emit }) {
      const AppStore = useAppStoreWithOut();
      AppStore.setMenuButtonBoundingClientRect();
      // #ifdef H5
      if (props.title) {
        document.title = props.title;
      }
      // #endif

      const isRootPage = computed(() => {
        const router = getCurrentPages();
        return router.length === 1;
      });
      const showLeftIcon = computed(() => {
        return !AppStore.getHasLeftIcon;
      });

      const back = () => {
        if (isRootPage.value) {
          // #ifdef MP
          useRoute({ type: 'reLaunch', url: '/pages/index/index' });
          // #endif
          // #ifndef MP
          useRoute({ type: 'reLaunch', url: '/pages/courses/courses' });
          // #endif
        } else {
          useRoute({ type: 'navigateBack' });
        }
      };
      const showTitle = computed(() => {
        const sceneNum = AppStore.scene;
        let app_edition = 'toutiao';
        // #ifdef MP-KUAISHOU
        app_edition = 'kuaishou';
        // #endif
        if (
          app_edition === 'toutiao' &&
          (sceneNum === '023009' || sceneNum === '021014' || sceneNum === '023010')
        ) {
          return false;
        } else if (app_edition === 'kuaishou' && sceneNum === '011013') {
          return false;
        } else {
          return true;
        }
      });
      const customStyle = computed(() => {
        const { type, shrink } = props;
        const rect = AppStore.getMenuButtonBoundingClientRect;
        // const { statusBarHeight } = AppStore.getSystemInfo;
        // 导航栏上边距，不存在右侧胶囊按钮的场景下取 状态栏高度+10px
        // "023010" 点击直播卡片半屏状态
        const top = rect.top;
        // 导航栏下边距，不存在右侧胶囊按钮的场景下取 10px
        const bottom = rect.bottom;
        // 最后计算出来的导航栏高度
        const height = top + rect.height + bottom;
        // 导航栏占用页面高度
        // #ifdef APP-PLUS
        const realHeight = type !== 'custom' || !shrink ? height : 0;
        // #endif
        // #ifndef APP-PLUS
        const realHeight = type !== 'custom' || !shrink ? height : 0;
        // #endif
        emit('loaded', realHeight);
        return {
          outer: {
            height: addUnit(realHeight),
            opacity: 1,
          },
          inner: {
            padding: `${addUnit(top)} ${addUnit(rect.right)} ${addUnit(bottom)} ${addUnit(
              rect.left,
            )}`,
            background: type === 'custom' ? 'transparent' : type,
            opacity: 1,
          },
          height: addUnit(rect.height),
          top: addUnit(top),
        };
      });

      return {
        isRootPage,
        showLeftIcon,
        back,
        customStyle,
        AppStore,
        showTitle,
      };
    },
  });
</script>

<template>
  <view
    class="overflow-hidden header-container"
    :style="AppStore.getIsFullScreen || showTitle ? customStyle.outer : { height: 0, opacity: 0 }"
    style="transform: all 0.3s linear"
  >
    <view
      class="fixed top-0 left-0 z-50 w-screen"
      style="transform: all 0.3s linear"
      :style="AppStore.getIsFullScreen || showTitle ? customStyle.inner : { opacity: 0 }"
    >
      <template v-if="showLeftIcon && !hideLeftIcon">
        <view
          class="absolute flex items-center overflow-hidden rounded-full left-8"
          :class="[
            textAlign || !showLeftIcon ? 'justify-center' : 'justify-start',
            {
              [`left-capsule ${color}`]: type === 'custom',
            },
          ]"
          :style="{
            height: customStyle.height,
            width: customStyle.height,
            top: customStyle.top,
          }"
          @click="back"
        >
          <template v-if="isRootPage">
            <image
              v-if="color === 'white'"
              src="https://ttmini.yizhiwechat.com/ktts/icons/home-white.png"
              mode="aspectFit"
              class="w-16 h-16"
            />
            <image
              v-else
              src="https://ttmini.yizhiwechat.com/ktts/icons/home-black.png"
              mode="aspectFit"
              class="w-16 h-16"
            />
          </template>
          <template v-else>
            <image
              v-if="color === 'white'"
              src="https://ttmini.yizhiwechat.com/ktts/icons/back-white.png"
              mode="aspectFit"
              class="h-[28rpx] w-[28rpx] -translate-x-[1px]"
            />
            <image
              v-else
              src="https://ttmini.yizhiwechat.com/ktts/icons/back-black.png"
              mode="aspectFit"
              class="h-[28rpx] w-[28rpx] -translate-x-[1px]"
            />
          </template>
        </view>
      </template>

      <view v-if="newTitle" class="title-value-new">
        <image v-if="authorAwatar" class="authorAvatar" :src="authorAwatar" mode="" />
        <view class="authorBox">
          <view class="authorName text-ellipsis">{{ authorName ? authorName : '' }}</view>
          <view class="lessonTitle text-ellipsis">{{ title }}</view>
        </view>
      </view>
      <view
        v-else
        class="flex items-center"
        :class="[textAlign === 'center' && showLeftIcon ? 'text-center' : 'text-left']"
        :style="{ height: customStyle.height }"
      >
        <text
          class="flex-1 min-w-0 overflow-hidden text-base font-semibold overflow-ellipsis whitespace-nowrap"
          :style="{ color }"
        >
          {{ title }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
  .title-value-new {
    background: rgba($color: #000, $alpha: 20%);
    height: 68rpx;
    border-radius: 34rpx;
    display: flex;
    align-items: center;

    .authorAvatar {
      flex: 0 0 60rpx;
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin-right: 10rpx;
      margin-left: 4rpx;
    }

    .authorBox {
      flex: 1;

      .authorName {
        width: 100%;
        font-size: 26rpx;
        font-weight: bold;
        color: #fefefe;
      }

      .lessonTitle {
        width: 100%;
        font-size: 20rpx;
        font-weight: 500;
        color: rgba($color: #fff, $alpha: 60%);
      }
    }
  }
</style>
