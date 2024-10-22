import request from 'uni-ajax';
import { HttpStatus } from '../../enums/http';
import { useUserStoreWithOut } from '../../store/modules/user';
import { useAppStoreWithOut } from '../../store/modules/app';
import { useRequestSign } from './useRequestSign';
import { useFailHandler } from './useFailHandler';
import { useRoute } from '../../hooks/core';
import queryString from '../query-string';
// @ts-expect-error
import { ApiUrl, Headers, mid, platform } from '/@/constants';

const apiKey = process.env.NODE_ENV;
const UserStore = useUserStoreWithOut();
const AppStore = useAppStoreWithOut();
const _platform = platform;
// console.log('AppStore', AppStore.getSystemInfo.deviceBrand);
// uni.showModal({
//   title: 'sda',
//   content: JSON.stringify(AppStore.getSystemInfo),
// });
// 创建请求实例
const instance = request.create(() => {
  // 初始配置
  return {
    baseURL: ApiUrl[apiKey!],
    header: Headers,
    data: {
      platform: _platform,
      mid: AppStore.getMid,
      scene: AppStore.getScene,
    },
    withToken: true,
  };
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (UserStore.getBanned) {
      useRoute({
        url: '/other/bannedPage/bannedPage',
        type: 'reLaunch',
      });
      // 用户已被封禁
      return Promise.reject({
        msg: '对不起，您的账户已被禁止使用',
        code: 0,
      });
    }
    if (config.loading) {
      uni.showLoading({
        mask: true,
        title: '请稍候',
      });
    }
    if (config.withToken) {
      // 使用签名
      const { time_stamp, nonce_str, sign, token } = useRequestSign({
        token: UserStore.getToken,
        data: config.data || {},
      });

      config.header['time-stamp'] = time_stamp.toString();
      config.header['nonce-str'] = nonce_str;
      config.header.sign = sign;
      config.header.token = token;
    }

    // 在发送请求前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  const { config, data: responseData, statusCode } = response;

  // HTTP请求状态码异常，直接进入 reject
  if (statusCode < 200 || statusCode >= 300) {
    return useFailHandler(response);
  }

  if (config.loading) {
    uni.hideLoading();
  }
  const { code, data, msg } = responseData;
  if (config.unintercept) {
    return responseData;
  }
  // #ifndef APP-PLUS
  console.log(`请求【${config.url!.match(/[a-z]+$/i)?.toString()}】`, config, data);
  // #endif
  switch (code) {
    case HttpStatus.success:
      return data;
      break;
    case HttpStatus.bannedAndTohome:
      useRoute({
        url: '/pages/index/index',
        type: 'reLaunch',
      });
      break;
    case HttpStatus.redirect:
      useRoute({
        url: msg,
        type: 'redirectTo',
      });
      break;
    case HttpStatus.logout:
    case HttpStatus.unlogin:
    case HttpStatus.serverTimingError:
    case HttpStatus.nopermise:
    case HttpStatus.noToken:
      // #ifdef H5
      UserStore.logout(() => {
        if (AppStore.getIsWeixinBrowser) {
          UserStore.setToken('');
          UserStore.setOpenid('');
          const url = queryString.merge(`${ApiUrl[apiKey!]}/wechat/auth`, {
            id: 37,
            scopes: 1,
            platform,
            back_url: queryString.merge(`${window.location.origin}/#/pages/login/auth`, {}),
          });
          window.location.href = url;
        } else {
          useRoute({
            type: 'reLaunch',
            url: '/pages/login/login',
          });
        }
      });
      // #endif
      // #ifdef MP
      uni.showModal({
        title: '登录失效',
        content: `对不起，您的登录状态已失效!
请点击小程序右上方重启小程序或者重启APP。`,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            tt.getUpdateManager().applyUpdate();
          }
        },
      });
      // #endif
      break;
  }
  return useFailHandler(response);
}, useFailHandler);
// 导出 create 创建后的实例
export default instance;
