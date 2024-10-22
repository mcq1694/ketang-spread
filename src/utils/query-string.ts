import { isEmpty } from '.';
const queryString = {
  /** 拼接url和参数，合并为合法的url结果 */
  merge(baseUrl: string, params: Record<string, any>) {
    // 使用正则匹配，主要依据是判断是否有"/","?","="等，如“/page/index/index?name=mary"
    return `${baseUrl}${/.*\/.*\?.*=.*/.test(baseUrl) ? '&' : '?'}${this.stringify(params).replace(
      /^&/,
      '',
    )}`;
  },
  /** 对象转换为url参数形式
   * @property {Object} param 将要转换为URL参数的字符串对象
   * @property {String} key 当传入类型不是object时， URL参数字符串的前缀
   * @property {Boolean} encode 是否进行URL编码，默认为true
   * @return {String} URL参数字符串
   */
  stringify(param: any, key?: string, encode = true): string {
    if (isEmpty(param)) {
      return '';
    }
    let result = '';
    const t = typeof param;
    if (t === 'string' || t === 'number' || t === 'boolean') {
      result = `&${key}=${encode ? encodeURIComponent(param) : param}`;
    } else {
      for (const i in param) {
        const k = key == null ? i : key + (Array.isArray(param) ? `[${i}]` : `.${i}`);
        result += queryString.stringify(param[i], k, encode);
      }
    }
    return result;
  },
  /**
   * @description url参数形式转换为对象
   */
  parse(url: string) {
    const result: { [k: string]: any } = {};
    const params = url.slice(!url.includes('?') ? 0 : url.indexOf('?'));
    const arr = params.split('&');
    arr.forEach((v) => {
      if (!v.includes('=')) {
        result[v] = undefined;
      } else {
        const str = v.split('=');
        if (!str[1].includes('%')) {
          result[str[0]] = str[1];
        } else {
          result[str[0]] = JSON.parse(decodeURIComponent(str[1]));
        }
      }
    });
    return result;
  },
};

export default queryString;
