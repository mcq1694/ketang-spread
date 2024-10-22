export enum HttpStatus {
  /** 请求成功，接口正常 */
  success = 200,
  /** 禁止访问，并直接重定向回首页 */
  bannedAndTohome = 1034,
  /** 禁止访问，并触发重定向，重定向地址在res.msg */
  redirect = 1038,
  /** 未登录 */
  unlogin = 3002,
  /** token登录态已过期 */
  logout = 3216002,
  /** 禁止用户访问，并直接重定向至封禁提示页 */
  bannedUser = 5006,
  /** 接口签名时间戳校验错误，并在res.msg返回最新的服务器时间（秒） */
  serverTimingError = 3104,
  /** 没有权限 */
  nopermise = 3201023,
  /** 没传token */
  noToken = 3003,
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
