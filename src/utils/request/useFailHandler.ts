import type { AjaxRequestConfig, AjaxResponse } from 'uni-ajax';
import { useUserStoreWithOut } from '../../store/modules/user';
import { delay } from '../index';
import request from './index';
const UserStore = useUserStoreWithOut();

/** 接口异常的统一处理，包括：
 * 公共的错误消息弹框
 * 异常日志上报
 * 接口错误自动重试
 * */
export async function useFailHandler(error: AjaxResponse) {
  console.log(error);
  const { statusCode, errMsg, config } = error;

  /** 接口重试逻辑，
   * 接口的结果是取最后一次重试的结果
   *  */
  if (config.retryOptions?.enable) {
    config.__retryCount = typeof config.__retryCount === 'number' ? config.__retryCount + 1 : 1;
    if (config.__retryCount <= config.retryOptions?.count) {
      let options =
        typeof config.retryOptions?.retryBefore === 'function'
          ? config.retryOptions.retryBefore(config)
          : config;
      // @ts-expect-error
      if (options instanceof Promise || typeof options.then === 'function') {
        options = await options;
      }

      // 不是合法的config,就终止请求重试
      if (typeof options === 'object') {
        return delay(config.retryOptions.wait || 0).then(() =>
          request(options as AjaxRequestConfig),
        );
      }
    }
  }

  /** 公共的错误消息弹框
   * 多次重试仅最后一次进行弹框
   *  */
  if (config.loading) {
    uni.hideLoading();
  }
  if (!config.hideModal) {
    if (error?.data?.code === 3201047) {
      // 手机号未注册提示
      UserStore.setUserRegister(true);
    } else {
      // uni.showModal({
      //   title: '提示',
      //   content: error?.data?.msg || `请求错误:${statusCode};;;;${JSON.stringify(config)}`,
      //   showCancel: false,
      // });
    }
  }
  return Promise.reject({
    code: error?.data?.code || statusCode,
    msg: error?.data?.msg || errMsg,
    response: error,
  });
}
