export function useStorage<T extends string>(options: { key?: string }) {
  const basickey = options?.key || 'KT_STORE_';
  return {
    getItem: (key: T) => uni.getStorageSync(basickey + key),
    setItem: (key: T, value: any) => uni.setStorageSync(basickey + key, value),
    removeItem: (key: T) => uni.removeStorageSync(basickey + key),
    clear: () => uni.clearStorageSync(),
  };
}

export default useStorage({});
