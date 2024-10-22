type ScopeList =
  | 'scope.userInfo'
  | 'scope.userLocation'
  | 'scope.userLocationBackground'
  | 'scope.address'
  | 'scope.record'
  | 'scope.writePhotosAlbum'
  | 'scope.album'
  | 'scope.camera'
  | 'scope.invoice'
  | 'scope.invoiceTitle'
  | 'scope.werun';

/**
 * @description 权限判断,建议在onShow调用否则拒绝并在setting页面又打开后无法获取授权结果；
 * 相册权限直接使用‘scope.writePhotosAlbum’，内部有判断是否头条端
 * @param {ScopeList} scope
 * @return {Promise<void>}
 */
export function authorize(scope: ScopeList, required = true, errMsg?: string): Promise<void> {
  // #ifdef H5
  return Promise.resolve();
  // #endif
  // #ifdef MP-TOUTIAO
  if (scope === 'scope.writePhotosAlbum') {
    scope = 'scope.album';
  }
  // #endif
  return new Promise(function (resolve, reject) {
    const showModal = () => {
      uni.showModal({
        title: '提示',
        content: errMsg || `获取相关权限失败，\n请在设置页中允许相关权限使用`,
        confirmText: '打开设置',
        success({ confirm }) {
          if (confirm) {
            openSetting(scope);
          }
        },
      });
    };

    getSetting(scope).then((is_auth) => {
      if (is_auth) {
        resolve();
      } else {
        uni.authorize({
          scope,
          success(auth) {
            // #ifndef MP-KUAISHOU
            if (auth.data && auth.data[scope] === 'ok') {
              resolve();
            }
            // #endif
            // #ifdef MP-KUAISHOU
            if (auth.errMsg === 'authorize:ok') {
              resolve();
            }
            // #endif
            else {
              required && showModal();
              reject(auth);
            }
          },
          fail(err) {
            required && showModal();
            reject(err);
          },
        });
      }
    });
  });
}

/**
 * @description 判断权限是否已经授权过
 * @param {ScopeList} scope
 * @return {Promise<boolean>}
 */
export function getSetting(scope: ScopeList): Promise<boolean> {
  // #ifdef MP-TOUTIAO
  if (scope === 'scope.writePhotosAlbum') {
    scope = 'scope.album';
  }
  // #endif
  return new Promise(function (resolve) {
    // #ifdef MP
    uni.getSetting({
      success: (auth) => {
        resolve(auth.authSetting[scope]);
      },
      fail() {
        resolve(false);
      },
    });
    // #endif
  });
}

/**
 * @description 判断权限是否已经授权过
 * @param {ScopeList} scope
 * @return {Promise<boolean>}
 */
export function openSetting(scope: ScopeList): Promise<boolean> {
  // #ifdef MP-TOUTIAO
  if (scope === 'scope.writePhotosAlbum') {
    scope = 'scope.album';
  }
  // #endif
  return new Promise(function (resolve) {
    uni.openSetting({
      success(res) {
        if (res.authSetting[scope]) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
    });
  });
}
