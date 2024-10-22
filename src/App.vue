<script setup lang="ts">
  import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
  import { useAppStoreWithOut } from '/@/store';
  import { aiConsole } from '/@/utils';

  const appStore = useAppStoreWithOut();

  onLaunch((option: any) => {});
  onShow(({ scene }) => {
    console.log('App Show');
  });
  onHide(() => {
    console.log('App Hide');
  });
</script>

<style lang="scss">
  @use './style/global.scss';
  @use 'tailwindcss/base';
  @use 'tailwindcss/utilities';

  /* 每个页面 公共css */

  /* 解决小程序和app滚动条的问题 */

  /* #ifdef MP-WEIXIN || APP-PLUS */
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-ce: none;
    background: transparent;
    color: transparent;
  }

  /* #endif */

  /* 解决H5 的问题 */

  /* #ifdef H5 */
  uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
    /* 隐藏滚动条，但依旧具备可以滚动的功能 */
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-ce: none;
    background: transparent;
    color: transparent;
  }

  /* #endif */
</style>
