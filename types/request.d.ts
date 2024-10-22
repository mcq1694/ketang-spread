// eslint-disable-next-line
import { AjaxRequestConfig } from 'uni-ajax';

declare module 'uni-ajax' {
  export interface AjaxRequestConfig {
    /**
     * @description 是否自动showLoading
     */
    loading?: boolean;
    /**
     * @description 接口请求拦截器不做处理，常用于第三方接口
     */
    withToken?: boolean;
    /**
     * @description 接口返回拦截器不做处理，返回值原样输出
     */
    unintercept?: boolean;
    /**
     * @description 接口错误不自动提示消息
     */
    hideModal?: boolean;
    /**
     * @description 接口自动重试配置（仅针对get请求有效）
     * @param {boolean} enable 是否启用自动重试
     * @param {number} count 最大重试次数
     * @param {number} wait 每次重试的延迟毫秒数
     */
    retryOptions?: {
      enable: boolean;
      count: number;
      wait: number;
      retryBefore?: (
        config: AjaxRequestConfig,
      ) => AjaxRequestConfig | false | Promise<AjaxRequestConfig | false>;
    };
    /**
     * @description 当前重试次数
     */
    __retryCount?: number;
  }
}
