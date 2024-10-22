import { defineStore } from 'pinia';
import { store } from '../index';
import { useStorage } from '../storage';
import { isEmpty } from '/@/utils';

export interface AppState {
  systemInfo: Partial<UniNamespace.GetSystemInfoResult>;
  hasLeftIcon: boolean;
  menuButtonBounding: UniApp.GetMenuButtonBoundingClientRectRes;
}

const storage = useStorage<keyof AppState>({ key: 'APP_STORE_' });

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    systemInfo: {},
    menuButtonBounding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      height: 0,
      width: 0,
    },
    hasLeftIcon: false,
  }),
  getters: {
    isIos() {
      const systemInfo = this.getSystemInfo;
      return systemInfo.platform === 'ios';
    },
    getSystemInfo(): Partial<UniNamespace.GetSystemInfoResult> {
      return isEmpty(this.systemInfo) ? storage.getItem('systemInfo') || {} : this.systemInfo;
    },
    getMenuButtonBoundingClientRect(): AppState['menuButtonBounding'] {
      return this.menuButtonBounding;
    },
    getHasLeftIcon(): boolean {
      return this.hasLeftIcon;
    },

    /** 是否微信浏览器 */
    getIsWeixinBrowser(): boolean {
      // #ifdef H5
      const ua = navigator.userAgent.toLowerCase();
      return !!/micromessenger/.test(ua);
      // #endif
      return false;
    },
  },
  actions: {
    setSystemInfo(): void {
      uni.getSystemInfo({
        success: (systemInfo) => {
          this.systemInfo = systemInfo;
          storage.setItem('systemInfo', systemInfo);
        },
      });
    },
    setMenuButtonBoundingClientRect(
      rect?: AppState['menuButtonBounding'],
    ): AppState['menuButtonBounding'] {
      if (rect) {
        return (this.menuButtonBounding = rect);
      }
      if (this.menuButtonBounding.height) {
        return this.menuButtonBounding;
      }

      const clientRect: AppState['menuButtonBounding'] = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
      const computedRect = (
        options: AppState['menuButtonBounding'] & {
          leftIcon?: AppState['menuButtonBounding'];
        },
      ) => {
        const { statusBarHeight } = this.getSystemInfo;

        clientRect.right = (this.getSystemInfo.windowWidth || 375) - options.left + 6 || 38;
        clientRect.height = options.height || 30;
        clientRect.top = options.top || (statusBarHeight || 0) + 10;
        clientRect.bottom = 10;

        // @description 头条小程序，已经自带了左侧返回按钮
        if (options.leftIcon) {
          this.hasLeftIcon = true;
          clientRect.left = options.leftIcon.left + options.leftIcon.width + 6;
        } else {
          // #ifdef MP-TOUTIAO
          clientRect.left = 48;
          // #endif
          // #ifndef MP-TOUTIAO
          clientRect.left = clientRect.right;
          // #endif
        }
      };

      // #ifdef MP-TOUTIAO
      try {
        const { leftIcon, capsule } = tt.getCustomButtonBoundingClientRect();
        if (leftIcon?.left) {
          computedRect({
            leftIcon,
            ...capsule,
          });
        } else if (capsule) {
          computedRect(capsule);
        } else {
          throw new Error('getCustomButtonBoundingClientRect is error');
        }
      } catch (err) {
        computedRect(uni.getMenuButtonBoundingClientRect());
      }
      // #endif
      // #ifndef MP-TOUTIAO
      computedRect(uni.getMenuButtonBoundingClientRect?.() || {});
      // #endif
      this.menuButtonBounding = clientRect;
      return this.menuButtonBounding;
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}
