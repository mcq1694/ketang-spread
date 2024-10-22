import dayjs from 'dayjs';
import { getAliOssToken } from '../api/public';
import type { OssSignModel } from '../api/public/model';
import { randomString } from './index';

/** 获取文件名称 */
function getFileName(file) {
  const suffix = file.substring(file.lastIndexOf('.'));
  return `${dayjs().valueOf()}_${randomString(8)}${suffix}`;
}

let sign: OssSignModel;
const signState = {
  loading: false,
  error: undefined,
};

const awaitSign = () => {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (sign) {
        clearInterval(timer);
        resolve(true);
      }
    }, 300);
  });
};

async function getSign({ path }) {
  // 验证签名是否在有效期内（偏移10秒确保有效）
  if (
    sign &&
    sign.dir === path &&
    dayjs().isBefore(dayjs(sign.expire * 1000).subtract(10, 'second'))
  ) {
    return sign;
  }
  if (signState.loading) {
    await awaitSign();
  }
  signState.loading = true;
  sign = await getAliOssToken({ path, type: 1, is_new: 0 });
  signState.loading = false;
  return sign;
}

/**
 * 上传文件至阿里云
 * @param options.filePath 上传的文件对象或者临时路径
 * @param options.path 上传文件存储的文件位置
 * @param options.onProgressUpdate 上传进度回调
 * @returns string
 */
export async function uploadFileToOss(options: {
  filePath: string | File;
  path: string;
  onProgressUpdate?: (_e: { progress: number }) => void;
}): Promise<string> {
  const path = options.path + (options.path.endsWith('/') ? '' : '/');
  console.log('pathpathpath', path);
  const sign = await getSign({ path });
  console.log('sign', sign);
  return new Promise(function (resolve, reject) {
    const params: UniApp.UploadFileOption = {
      url: sign.host,
      name: 'file',
      formData: {
        // 下面的属性名称 大小写无所谓 都能通过
        Key: sign.dir, // OSS存储路径
        policy: sign.policy, // 后端Base64编码格式的授权策略 用于签名
        OSSAccessKeyId: sign.accessid, // OSS控制台获取
        success_action_status: '200', // 让服务端返回200,不然，成功上传图片后阿里默认返回statusCode: 204
        signature: sign.signature, // 服务端返回的签名内容
        Bucket: 'image-to-video',
      },
      success: () => {
        console.log('successsuccess', sign.cdn_host, params);
        resolve(`${sign.cdn_host}${sign.cdn_host.endsWith('/') ? '' : '/'}${params.formData.Key}`);
      },
      fail: (err) => {
        console.log('上传失败', err);
        reject(err.errMsg);
      },
    };
    // 平台差异
    // #ifndef H5
    params.filePath = options.filePath as string;
    params.formData.Key = path + getFileName(options.filePath);
    // #endif
    // #ifdef H5

    if (options.filePath) {
      console.log('options.filePath', options.filePath);
      console.log('213', options.filePath instanceof File);
      params.file = options.filePath;
      params.formData.Key = path + getFileName(options.filePath.name);
    }
    // #endif

    const uploadTask = uni.uploadFile(params);
    uploadTask.onProgressUpdate((res) => {
      // #ifndef MP-KUAISHOU
      options.onProgressUpdate?.({ progress: Math.round(res.progress) });
      // #endif
      // #ifdef MP-KUAISHOU
      options.onProgressUpdate?.({ progress: Math.round(res.progress * 100) });
      // #endif
    });
  });
}
