export const SmUECGhandler = {
  handle(usbComDevice, packageStringData) {
    const failResult = {
      success: false,
      config: { gain: 0.0, channel: '', samplingRate: 0 },
    };
    if (packageStringData.includes(`OK+UECG=1`)) {
      try {
        const data = packageStringData.replace(`OK+UECG=1,`, '');
        const message = data.split(',');
        const channel = message[0];
        const samplingRate = parseInt(message[1], 10);
        if (isNaN(samplingRate)) return failResult;
        const gain = parseFloat(message[2]);
        if (isNaN(gain)) return failResult;
        usbComDevice.onUpdateECGConfig({ gain, channel, samplingRate });
        return {
          success: true,
          config: { gain, channel, samplingRate },
        };
      } catch (e) {
        return failResult;
      }
    }
    return failResult;
  },
};
