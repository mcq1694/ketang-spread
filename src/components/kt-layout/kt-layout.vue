<!--
* @description  所有页面的公共布局组件,已内置header和footer两个组件
* @fileName  kt-layout
* @date 2022-11-08 15:22:35
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { computed, defineComponent, ref, watchEffect } from 'vue';
  import { isObject } from 'lodash';
  import { addUnit } from '/@/utils';
  import KtHeader from '../kt-header/kt-header.vue';
  import type { Props as HeaderProps } from '../kt-header/props';

  export default defineComponent({
    name: 'KtLayout',
    components: {
      KtHeader,
    },
    props: {
      /**
       * @description 页面的背景
       */
      background: {
        type: String,
      },
      /**
       * @description
       * @param none 不做任何处理
       * @param full 内容区域设置最小高度，最小高度=视口高度-导航栏高度-页脚高度;
       * @param fixed 内容区域设置固定高度，相当于禁止Y轴滑动，也便于某些需要固定一屏的布局处理;
       */
      heightMode: {
        type: String as PropType<'none' | 'full' | 'fixed'>,
        default: 'none',
      },
      /**
       * @description 结合heightMode使用,直接指定内容区域的高度
       */
      height: {
        type: Number,
      },
      /**
       * @description 页面是否使用原生tabbar,在H5页面下需要通过css变量var(--tab-bar-height)减去额外高度
       */
      hasTabbar: {
        type: Boolean,
        default: false,
      },
      overflowHidden: {
        type: Boolean,
        default: false,
      },
      header: {
        type: [Boolean, Object] as PropType<boolean | Partial<HeaderProps>>,
        default: true,
      },
      headerHeight: {
        type: Number,
      },
      footerHeight: {
        type: Number,
      },
      // 页面头部背景是否白色
      heraderBgWhite: {
        type: Boolean,
        default: false,
      },
      /**
       * @description 左上角返回键回调
       */
      needCallback: {
        type: Boolean,
        default: false,
      },
    },
    emits: {
      'update:headerHeight': (_height: number) => true,
      'update:footerHeight': (_height: number) => true,
      clickBack: (_count: number) => true,
    },
    setup(props, { emit }) {
      /** H5 平台不使用自定义导航栏 */
      const useHeader = false;
      // #ifdef H5
      watchEffect(() => {
        if (isObject(props.header) && props.header.title) {
          document.title = props.header.title;
        }
      });
      // #endif
      /** 生成导航栏组件的参数 */
      const headerHeight = ref(0);
      const headerConfig = computed(() => {
        return isObject(props.header) ? props.header : {};
      });
      /** 生成页脚组件的参数 */
      const footerHeight = ref(0);
      const contentStyle = computed(() => {
        const config: Record<string, string> = {};
        let tabbarHeight = '0px';
        // #ifdef H5
        if (props.hasTabbar) {
          tabbarHeight = `var(--tab-bar-height) - env(safe-area-inset-bottom)`;
        }
        // #endif
        const height = props.height
          ? addUnit(props.height)
          : `calc(100vh - ${addUnit(headerHeight.value)} - ${addUnit(
              footerHeight.value,
            )} - ${tabbarHeight})`;

        if (props.heightMode === 'fixed') {
          config.height = height;
        } else if (props.heightMode === 'full') {
          config.minHeight = height;
        }
        if (props.overflowHidden) {
          config.overflow = 'hidden';
        }
        return config;
      });

      function loaded(height: number, type: 'header' | 'footer') {
        if (type === 'header') {
          headerHeight.value = height;
          emit('update:headerHeight', height);
        } else if (type === 'footer') {
          footerHeight.value = height;
          emit('update:footerHeight', height);
        }
      }

      return { contentStyle, loaded, headerConfig, useHeader, emit };
    },
  });
</script>

<template>
  <view :style="{ background: background || '' }" class="relative mx-auto w-375">
    <KtHeader
      v-if="header && useHeader"
      :herader-bg-white="heraderBgWhite"
      :needCallback="needCallback"
      v-bind="headerConfig"
      @loaded="
        ($event) => {
          loaded($event, `header`);
        }
      "
      @click-back="
        ($event) => {
          emit('clickBack', $event);
        }
      "
    >
      <template #search> <slot name="search"></slot> </template>
    </KtHeader>
    <view :style="contentStyle">
      <slot></slot>
    </view>
  </view>
</template>

<style lang="scss"></style>
