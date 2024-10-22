/**
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function uuid(len = 32, firstU = true, radix = 0): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid: string[] = [];
  radix = radix || chars.length;

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
  if (firstU) {
    uuid.shift();
    return `u${uuid.join('')}`;
  }
  return uuid.join('');
}

/**
 * @description 把数字转为例如带k/w的值, 四舍五入
 */
export function numberFormat(
  value: number,
  precision = 0,
  options: {
    suffix: string;
    ratio: number;
  } = {
    suffix: 'k',
    ratio: 1000,
  },
): string {
  if (value > options.ratio) {
    return (value / options.ratio).toFixed(precision) + options.suffix;
  } else if (/\d+/.test(String(value))) {
    return `${value}`;
  }
  return '0';
}

/**
 * @description 判断是否为空,包含空数组和空对象
 */
export function isEmpty(value) {
  switch (typeof value) {
    case 'undefined':
      return true;
    case 'string':
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0) {
        return true;
      }
      break;
    case 'boolean':
      if (!value) {
        return true;
      }
      break;
    case 'number':
      if (value === 0 || isNaN(value)) {
        return true;
      }
      break;
    case 'object':
      if (value === null || value.length === 0) {
        return true;
      }
      // eslint-disable-next-line no-unreachable-loop
      for (const _i in value) {
        return false;
      }
      return true;
  }
  return false;
}

/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export function addUnit(value: string | number = 'auto', unit = 'px') {
  value = String(value);
  // 验证value是否是纯数字
  return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value) ? `${value}${unit}` : value;
}

/**
 * @description 获取实际像素大小，rpx将会转换为px
 * @param {string|number} value 需要添加单位的值
 * @param {boolean} unit 是否添加单位px
 */
export function getPx(value: string | number): number;
export function getPx(value: string | number, unit: true): string;
export function getPx(value, unit = false) {
  value = String(value);
  // 如果带有rpx，先取出其数值部分，再转为px值
  if (/(rpx|upx)$/.test(value)) {
    if (uni.upx2px) {
      value = uni.upx2px(parseInt(value));
    } else {
      const { windowWidth } = uni.getSystemInfoSync();
      value = Math.round(parseInt(value) * (windowWidth / 750));
    }
  } else {
    value = parseInt(value);
  }
  if (unit) {
    return `${value}px`;
  } else {
    return value;
  }
}

/**
 * @description 查询节点信息,目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21),解决办法为在组件根部再套一个没有任何作用的view元素
 * @param {string} selector 选择器,传空字符串表示查询当前视口
 * @param {Component} self 当前组件的this对象
 */
export function queryRect(selector: string, self: any): Promise<UniApp.NodeInfo> {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery().in(self);
    if (selector) {
      query
        .select(selector)
        .boundingClientRect((rect) => {
          if (isEmpty(rect)) {
            reject();
          } else {
            resolve(rect as UniApp.NodeInfo);
          }
        })
        .exec();
    } else {
      query
        .selectViewport()
        .fields({ rect: true, size: true, scrollOffset: true }, (rect) => {
          resolve(rect as UniApp.NodeInfo);
        })
        .exec();
    }
  });
}
export function queryAllRect(selector: string, self: any): Promise<UniApp.NodeInfo[]> {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery().in(self);
    query
      .selectAll(selector)
      .boundingClientRect((rect) => {
        if (Array.isArray(rect) && rect.length) {
          resolve(rect);
        } else {
          reject();
        }
      })
      .exec();
  });
}

/**
 * @description 把定时器setTimeout包装成Promise,便于例如await调用
 * @param waitTime
 * @returns Promise
 */
export function delay(waitTime: number) {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}

/**
 * @description 下标转换为大写字母，常用语问答序号
 */
export function fromCharCode(num: number) {
  return `${String.fromCharCode(num + 65)}`;
}
/**
 * @description 小程序检测版本更新
 */
export function checkForUpdates() {
  const updateManager = uni.getUpdateManager();
  updateManager.onCheckForUpdate(function (_res) {
    // 请求完新版本信息的回调
  });
  updateManager.onUpdateReady(function (_res) {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      },
    });
  });
}
/**
 * @description 二次封装弹出函数
 * @param {String} options string 默认icon none
 */
export function showToast(options: string | UniNamespace.ShowToastOptions): void {
  let obj: UniNamespace.ShowToastOptions = {};
  if (typeof options === 'string') {
    obj.icon = 'none';
    obj.title = options;
  } else {
    obj = options;
  }
  uni.showToast(obj);
}

/**
 * @description 人数转w
 */
export function heatFormat(heat_num: number) {
  if (heat_num > 1e4) {
    return `${(heat_num / 1e4).toFixed(1)}万`;
  } else if (/\d+/.test(String(heat_num))) {
    return heat_num;
  }
  return 0;
}

export function timeout(delay, callback) {
  return new Promise(function (resolve) {
    const timeout = setTimeout(function () {
      const resolve_data_raw = {
        timeout_id: timeout,
      };
      if (callback) {
        // @ts-expect-error
        const callback_return_raw = callback.call(this, { ...resolve_data_raw });
        if (callback_return_raw instanceof Promise) {
          return callback_return_raw.then(function (resolve_raw) {
            resolve_data_raw.args = resolve_raw;
            return resolve(resolve_data_raw);
          });
        } else {
          resolve_data_raw.args = callback_return_raw;
          return resolve(resolve_data_raw);
        }
      }
      return resolve(resolve_data_raw);
    }, delay * 1000);
  });
}

/** 生成随即字符串 */
export function randomString(len: number) {
  len = len || 32;
  // const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz-';
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/** 图片文件临时路径转为base_64 */
export function imageToBase64(filePath, base_header = 'data:image/jpg;base64,'): Promise<string> {
  return new Promise(function (resolve, reject) {
    // #ifdef MP
    uni.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success(baseData) {
        resolve((base_header || '') + baseData.data);
      },
      fail(e) {
        reject(e);
      },
    });
    // #endif
    // #ifdef H5
    reject();
    // #endif
  });
}

/** File文件转base64;
 * 由于H5下获取本地文件都是File
 */
export function readFileObject(value: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = function () {
      resolve(this.result);
    };
    reader.onerror = () => {
      reject();
    };
  });
}

/** base64图片转为file对象用于上传 */
export function base64ToFile(data: string): File {
  const arr = data.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type: mime });
  return new File([blob], `${Date.now()}${mime?.replace(/^([a-z]*\/)?/, '.') || '.jpg'}`, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

/** 版本号对比 */
// version1>=version2?1:0
export function compareVersion(version1, version2) {
  const arr1 = version1.split('.');
  const arr2 = version2.split('.');
  const length1 = arr1.length;
  const length2 = arr2.length;
  const minlength = Math.min(length1, length2);
  let i = 0;
  for (i; i < minlength; i++) {
    const a = parseInt(arr1[i]);
    const b = parseInt(arr2[i]);
    if (a > b) {
      return 1;
    } else if (a < b) {
      return 0;
    }
  }
  if (length1 > length2) {
    for (let j = i; j < length1; j++) {
      if (parseInt(arr1[j]) !== 0) {
        return 1;
      }
    }
    return 1;
  } else if (length1 < length2) {
    for (let j = i; j < length2; j++) {
      if (parseInt(arr2[j]) !== 0) {
        return 0;
      }
    }
    return 1;
  }
  return 1;
}

// 获取当前时间精确到日
export function getTimeD() {
  const yy = new Date().getFullYear();
  const mm = new Date().getMonth() + 1;
  const dd = new Date().getDate();
  // + ":" + ms;
  return `${yy}${mm > 10 ? mm : `0${mm}`}${dd > 10 ? dd : `0${dd}`}`;
}
export function getTimeStamp(time?) {
  return Date.parse(time || new Date());
}

export function dateFormat(time, fmt) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  const date = time ? new Date(time) : new Date();
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  }
  return fmt;
}

/*
 * query形式转json
 * */
export function queryToJson(str) {
  if (str.includes('%')) {
    str = decodeURIComponent(str);
  }
  const obj = {};
  str.replace(/([^?=&]+)(=([^&]*))?/g, function ($0, $1, $2, $3) {
    obj[$1] = $3;
  });
  return obj;
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
export function jsonToQuery(data = {}, isPrefix = true, arrayFormat = 'brackets') {
  const prefix = isPrefix ? '?' : '';
  const _result: any = [];
  if (!['indices', 'brackets', 'repeat', 'comma'].includes(arrayFormat)) {
    arrayFormat = 'brackets';
  }
  for (const key in data) {
    const value = data[key];
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue;
    }
    // 如果值为数组，另行处理
    if (value.constructor === Array) {
      // e.g. {ids: [1, 2, 3]}
      switch (arrayFormat) {
        case 'indices':
          // 结果: ids[0]=1&ids[1]=2&ids[2]=3
          for (let i = 0; i < value.length; i++) {
            _result.push(`${key}[${i}]=${value[i]}`);
          }
          break;
        case 'brackets':
          // 结果: ids[]=1&ids[]=2&ids[]=3
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
          break;
        case 'repeat':
          // 结果: ids=1&ids=2&ids=3
          value.forEach((_value) => {
            _result.push(`${key}=${_value}`);
          });
          break;
        case 'comma':
          // 结果: ids=1,2,3
          // eslint-disable-next-line no-case-declarations
          let commaStr = '';
          value.forEach((_value) => {
            commaStr += (commaStr ? ',' : '') + _value;
          });
          _result.push(`${key}=${commaStr}`);
          break;
        default:
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
      }
    } else {
      _result.push(`${key}=${value}`);
    }
  }
  return _result.length ? prefix + _result.join('&') : '';
}

// 获取当前时间精确到毫秒
export function getTime() {
  let dateTime;
  const yy = new Date().getFullYear();
  const mm = new Date().getMonth() + 1;
  const dd = new Date().getDate();
  const hh = new Date().getHours();
  const mf = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes();
  const ss = new Date().getSeconds() < 10 ? `0${new Date().getSeconds()}` : new Date().getSeconds();
  // const ms = new Date().getMilliseconds();
  // + ":" + ms;
  // eslint-disable-next-line prefer-const
  dateTime = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
  return dateTime;
}

// 预览图片
export function previewImage(param: { current: string; urls: Array<string> }) {
  uni.previewImage({
    current: param.current,
    urls: param.urls,
  });
}

/**
 * 验证身份证号码
 */
export function idCard(value: string) {
  return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
}

/**
 * 转换手机号
 */
export function transPhone(value: string) {
  if (value.length === 11) {
    return `${value.slice(0, 3)}****${value.slice(7)}`;
  } else {
    return '';
  }
}

/**
 * 处理时间
 */
export function transTime(time: string) {
  // 创建一个表示当前时间的 Date 对象
  const currentDate = new Date();

  // 获取当前年份、月份、日期
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 注意月份是从 0 开始计算的，所以要加 1
  const currentDay = currentDate.getDate();

  // 创建一个表示要判断的时间的 Date 对象
  const targetDate = new Date(time); // 这里假设要判断的时间是 2023 年 2 月 25 日

  // 获取要判断的时间的年份、月份、日期
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();

  // 判断年份、月份、日期是否都相等
  if (currentYear === targetYear && currentMonth === targetMonth && currentDay === targetDay) {
    return time.slice(11, 16);
  } else {
    return `${time.slice(5, 7)}/${time.slice(8, 16)}`;
  }
}

export function handleTime(second) {
  if (second >= 60) {
    return `${Math.floor(Number(second) / 60)}小时`;
  } else {
    return `${second}分钟`;
  }
}
// 去掉打印输出
export function aiConsole() {
  console.log = () => {};
}

export function regPhone(tel) {
  if (/^1[3456789]\d{9}$/.test(tel)) {
    return true;
  } else {
    return false;
  }
}
/**
 * Export a function called checkInstallApp that takes a platform as an argument (either 'dy' or 'ks')
 * @param {String} platform - 平台
 * @return {Boolean} true 已经安装 false 没安装且提示
 */
export function checkInstallApp(platform: 'dy' | 'ks' | 'wx', isIos?): boolean {
  // Set the pname to the appropriate value based on the platform
  const pname =
    platform === 'dy'
      ? isIos
        ? 'com.ss.iphone.ugc.Aweme'
        : 'com.ss.android.ugc.aweme'
      : platform === 'ks'
      ? 'com.smile.gifmaker'
      : 'com.tencent.mm';
  // Set the action to the appropriate value based on the platform
  const action = platform === 'dy' ? 'snssdk1128://' : platform === 'ks' ? 'kwai://' : 'weixin://';
  // Check if the application exists with the given pname and action
  if (plus.runtime.isApplicationExist({ pname, action })) {
    // If the application exists, return true
    return true;
  } else {
    // If the application does not exist, show a toast message with the appropriate platform name
    showToast(`请先安装${platform === 'dy' ? '抖音' : platform === 'ks' ? '快手' : '微信'}app`);
    // Return false
    return true;
  }
}

/**
 * 单位转换 价格由分转为元，保留两位小数
 */
export function moneyConversion(price?: number | string) {
  if (!price) {
    return '0.00';
  }
  return (Number(price) / 100).toFixed(2);
}
