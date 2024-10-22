export const IsDevelop = process.env.NODE_ENV === 'development';

export const ApiUrl = {
  development: 'https://share-folder-api-dev.yizhiweixin.com/',
  production: 'https://share-folder-api.yizhiweixin.com',
};
// #ifdef H5-DEVELOP
ApiUrl.production = 'https://share-folder-api-dev.yizhiweixin.com/';
// #endif
// #ifdef H5-PRERELEASE
ApiUrl.production = 'https://share-folder-api.yizhiweixin.com';
// #endif
