/**
 * 路由跳转方法，该方法相对于直接使用uni.xxx的好处是使用更加简单快捷
 * 并且带有路由拦截功能
 */
import { merge } from 'lodash';
import qs from '../../utils/query-string';
type routeType = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'navigateBack';

export interface RouteConfig {
  type: routeType;
  url: string;
  delta?: number; // navigateBack页面后退时,回退的层数
  params?: AnyObject; // 传递的参数
  animationType?: 'pop-in'; // 窗口动画,只在APP有效
  animationDuration?: number; // 窗口动画持续时间,单位毫秒,只在APP有效
  intercept?: boolean; // 是否需要拦截
}

class Router {
  // 原始属性定义
  config: RouteConfig = {
    type: 'navigateTo',
    url: '',
    delta: 1, // navigateBack页面后退时,回退的层数
    params: {}, // 传递的参数
    animationType: 'pop-in', // 窗口动画,只在APP有效
    animationDuration: 300, // 窗口动画持续时间,单位毫秒,只在APP有效
    intercept: false, // 是否需要拦截
  };

  constructor() {
    // 因为route方法是需要对外赋值给另外的对象使用，同时route内部有使用this，会导致route失去上下文
    // 这里在构造函数中进行this绑定
    this.route = this.route.bind(this);
  }

  // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
  addRootPath(url) {
    return url;
    // return (url && url[0]) === '/' ? url : `/${url}`
  }

  // 整合路由参数
  mixinParam(url, params) {
    url = this.addRootPath(url);
    if (!params) {
      return url;
    }
    return qs.merge(url, params);
  }

  // 对外的方法名称
  async route(
    options: string | Partial<RouteConfig> = {},
    params: Record<string, string | number> = {},
  ) {
    // 合并用户的配置和内部的默认配置
    let mergeConfig: Partial<RouteConfig> = {};

    if (typeof options === 'string') {
      // 如果options为字符串，则为route(url, params)的形式
      mergeConfig.url = this.mixinParam(options, params);
      mergeConfig.type = 'navigateTo';
    } else {
      mergeConfig = merge({}, this.config, options);
      // 否则正常使用mergeConfig中的url和params进行拼接
      mergeConfig.url = this.mixinParam(options.url, options.params);
    }
    // if (options.intercept) {
    //   this.config.intercept = options.intercept;
    // }
    // params参数也带给拦截器
    mergeConfig.params = params;
    // 合并内外部参数
    mergeConfig = merge({}, this.config, mergeConfig);
    // 判断用户是否定义了拦截器
    // if (typeof uni.$yt.routeIntercept === 'function') {
    //   // 定一个promise，根据用户执行resolve(true)或者resolve(false)来决定是否进行路由跳转
    //   const isNext = await new Promise((resolve) => {
    //     uni.$yt.routeIntercept(mergeConfig, resolve);
    //   });
    //   // 如果isNext为true，则执行路由跳转
    //   isNext && this.openPage(mergeConfig);
    // } else {
    this.openPage(mergeConfig);
    // }
  }

  // 执行路由跳转
  openPage(config) {
    // 解构参数
    const { url, type, delta, animationType, animationDuration } = config;
    if (type === 'navigateTo') {
      uni.navigateTo({
        url,
        animationType,
        animationDuration,
      });
    }
    if (type === 'redirectTo') {
      uni.redirectTo({
        url,
      });
    }
    if (type === 'switchTab') {
      uni.switchTab({
        url,
      });
    }
    if (type === 'reLaunch') {
      uni.reLaunch({
        url,
      });
    }
    if (type === 'navigateBack') {
      // #ifdef H5
      window.history.go(-delta);
      // #endif
      // #ifndef H5
      uni.navigateBack({
        delta,
      });
      // #endif
    }
  }
}

/**
 * @description 封装路由跳转方法，以便于传参和处理路由拦截等功能
 */
export const useRoute = new Router().route;

export default useRoute;
