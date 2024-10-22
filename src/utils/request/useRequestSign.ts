import type { Data } from 'uni-ajax';
import { merge } from 'lodash';
import { uuid } from '../index';
import CryptoJS from './crypto/core';
import Base64 from './crypto/enc-base64';
import MD5 from './crypto/md5';
const decrypt = 'dcwsnmsb';

/**
 * @description 对象的key进行按ascii码从小到大排序，并转换为字符串，用以确保相同内容的对象生成唯一的key值
 * @param {object} obj
 * @return {string}
 */
export function useSortByAscii(obj: AnyObject) {
  let str = '';

  const testFun = function (item) {
    if (item === null) {
      item = '';
    }

    if (Object.prototype.toString.call(item) === '[object Object]') {
      return `{${useSortByAscii(item)}}`;
    } else if (Object.prototype.toString.call(item) === '[object Array]') {
      return `[${useSortByAscii(item)}]`;
    } else {
      return item;
    }
  };

  if (Object.prototype.toString.call(obj) === '[object Object]') {
    const keys = Object.keys(obj).sort();
    for (const item in keys) {
      str += `${keys[item]}=${testFun(obj[keys[item]])}&`;
    }
    const char = '&';
    str = str.replace(new RegExp(`^\\${char}+|\\${char}+$`, 'g'), '');
  } else if (Object.prototype.toString.call(obj) === '[object Array]') {
    obj.forEach((element) => {
      str += `${testFun(element)},`;
    });
    const char = ',';
    str = str.replace(new RegExp(`^\\${char}+|\\${char}+$`, 'g'), '');
  }
  return str;
}

export function useRequestSign(config: { token: string; data: Data }) {
  for (const key in config.data as AnyObject) {
    if (config.data?.[key] == null) {
      config.data![key] = '';
    }
  }

  const token = config.token;
  const time_stamp = Math.round(+new Date() / 1000); // 时间戳
  const nonce_str = uuid(32); // 随机字符串
  const ascii_result = useSortByAscii(merge({ nonce_str, time_stamp, token }, config.data));
  const sign_before = decrypt + Base64.stringify(CryptoJS.enc.Utf8.parse(ascii_result));
  const sign_md5 = MD5(sign_before).toString();
  const sign_type = (time_stamp % 5) % 2;
  const sign = sign_type ? sign_md5 + token : token + sign_md5;

  return {
    time_stamp,
    nonce_str,
    sign,
    token,
  };
}
