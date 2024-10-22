import crypto from 'crypto-js';
import * as Base64 from 'js-base64';
import { getOBSUploadInfo } from '../api/public/index';
// const Base64 = require('js-base64');
console.log('js-base64', Base64);
/**
 * 上传文件至华为云
 * @param options.filePath 上传的文件对象或者临时路径
 * @param options.path 上传文件存储的文件位置
 * @param options.onProgressUpdate 上传进度回调
 * @returns string
 */
export function uploadFileToObs(options) {
  return new Promise(async function (resolve, reject) {
    const tmpFile = options.filePath.slice(options.filePath.lastIndexOf('/') + 1);
    const newFile = `${Date.now()}.${tmpFile.split('.')[1]}`;
    const { bucket, credential, end_point, cdn_point, upload_path } = await getOBSUploadInfo({
      type: 1,
    });
    const OBSPolicy = {
      // 设定policy内容，policy规则定义可参考步骤3中的超链接签名计算规则文档
      expiration: credential.expires_at,
      conditions: [
        { bucket }, // 桶名要和配置文件中endpoint中的桶名保持一致
        { 'x-obs-security-token': credential.securitytoken }, // 如果是临时访问秘钥鉴权，必须设置该值
        { key: upload_path + newFile },
      ],
    };
    const policyEncoded = getPolicyEncode(OBSPolicy);
    const signature = getSignature(policyEncoded, credential.secret);
    const uploadTask = uni.uploadFile({
      url: end_point,
      filePath: options.filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data; boundary=-9431149156168',
      },
      formData: {
        // 从配置文件中获取到的AK信息、计算得到的编码后policy及signature信息
        AccessKeyID: credential.access,
        policy: policyEncoded,
        signature,
        key: upload_path + newFile,
        'x-obs-security-token': credential.securitytoken, // 如果是临时访问秘钥鉴权，必须设置该值
      },

      success: (res) => {
        console.log(res.statusCode); // 打印响应状态码
        if (Number(res.statusCode) === 204) {
          console.log('Uploaded successfully', res);
          resolve(`${cdn_point}/${upload_path}${newFile}`);
        } else {
          console.log('Uploaded failed', res);
          reject(res);
        }
      },
      fail: (err) => {
        reject(err.errMsg);
      },
    });
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

function getPolicyEncode(policy) {
  // 传入表单上传的policy字段，对policy进行Base64编码
  const encodedPolicy = Base64.encode(JSON.stringify(policy));
  return encodedPolicy;
}
function getSignature(policyEncoded, SecretKey) {
  // 利用SK对Base64编码后的policy结果进行HMAC-SHA1签名计算
  const bytes = crypto.HmacSHA1(policyEncoded, SecretKey);
  // 对计算结果进行Base64编码，得到最终的签名信息
  const signature = crypto.enc.Base64.stringify(bytes);
  return signature;
}
