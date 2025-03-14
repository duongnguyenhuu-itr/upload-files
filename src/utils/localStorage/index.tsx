const { localStorage } = global.window;

interface IAppLocalStorage {
  setLoginBiocare: (bool: boolean) => void;
  isLoginBiocare: () => boolean;
  setDeviceId: (deviceId: string, vendorId_productId: string) => void;
  getDeviceId: (vendorId_productId: string) => string;
}

const appLocalStorage: IAppLocalStorage = {
  setLoginBiocare(isLogin: boolean) {
    localStorage.setItem('isLoginBiocare', isLogin.toString());
  },

  isLoginBiocare() {
    return localStorage.getItem('isLoginBiocare') === 'true';
  },

  setDeviceId(vendorId_productId: string, deviceId: string) {
    localStorage.setItem(vendorId_productId, deviceId);
  },

  getDeviceId(vendorId_productId: string) {
    return localStorage.getItem(vendorId_productId) || '';
  },
};

export default appLocalStorage;
