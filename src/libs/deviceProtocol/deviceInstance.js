import { SmKA } from '../../libs/deviceProtocol/core/command/sm/smKA';
import { SmSPREBOOT } from '../../libs/deviceProtocol/core/command/sm/smSPREBOOT';
import { SmUECG } from '../../libs/deviceProtocol/core/command/sm/smUECG';
import { FrameUtils } from '../../libs/deviceProtocol/util/frameUtils';
import { WebSerial } from '../../libs/webSerial/webSerial';
import { WebSocketClient } from '../../libs/webSocketClient/webSocketClient';
import { consoleTimeLog } from '../../utils';
import { Constant } from './constant';
import { SmID } from './core/command/sm/smID';
import { SmMass } from './core/command/sm/smMass';
import { SmNWADAPTER } from './core/command/sm/smNWADAPTER';
import { SmStudy } from './core/command/sm/smStudy';
import { SynCmd } from './core/command/usbSyn/synCmd';
import { ChannelID } from './core/enum/channelID';
import { ConnectionState } from './core/enum/connectionState';
import { NetworkAdapterType } from './core/enum/networkAdapterType';
import { FrameHandler } from './core/handler/frameHandler';
import { PackageHandler } from './core/handler/packageHandler';
import { ByteUtils } from './util/byteUtils';
import { FrameBuilder } from './util/frameBuilder';
import { PackageBuilder } from './util/packageBuilder';

export class DeviceInstance {
  constructor(isUSB = true) {
    this.isUSB = isUSB;
    this.deviceId = '';
    this.path = '';
    this.lostNetwork = false;
    this.scanningBT = false;
    this.ecgConfig = null;
    this.deviceKey = null;
    this.randomKey = '';
    this.schemaVersion = 0;
    this.networkAdapterType = null;
    this.sequenceNumber = 0;
    this.deviceSequenceNumber = 0;
    this.connectionState = 0;
    this.onDeviceInfoFunc = null;
    this.onDeviceIdFunc = null;
    this.kaTimeout = null;
    this.onUpdateDeviceInfo = this.onUpdateDeviceInfo.bind(this);
    this.clearInterval = this.clearInterval.bind(this);
    this.close = this.close.bind(this);
    // this.closeBackToUsb = this.closeBackToUsb.bind(this);
    this.btWriteToDeviceBuffer = [];
    this.selfClose = this.selfClose.bind(this);
    // this.selfCloseTCPSocket = this.selfCloseTCPSocket.bind(this);
    this.handleFrameFromDevice = this.handleFrameFromDevice.bind(this);
    this.sendPackageToDevice = this.sendPackageToDevice.bind(this);
    this.sendSPRebootToDevice = this.sendSPRebootToDevice.bind(this);
    // this.selfCloseBT = this.selfCloseBT.bind(this);
    // this.selfCloseUSB = this.selfCloseUSB.bind(this);
    this.selfClose = this.selfClose.bind(this);
    this.startWaitingRequestConnectServerInterval =
      this.startWaitingRequestConnectServerInterval.bind(this);
    this.exportStartInterval = null;
    this.timeWaitingExportStartStatus = 0;
    this.maxTimeWaitingExportStartStatus = 4;
    this.onConnectedFunc = null;
    this.onConnectedUsbFunc = null;
    this.onDisconnectFunc = null;
    this.onErrorBTFunc = null;
    this.dataBuffer = [];
    this.waitingRequestConnectServerInterval = null;

    this.ecgDataBuffer = [];

    /*========== Web Serial ==========*/
    this.webSerial = null;
    this.waitingConnectSerialTimeout = null;
    this.onSerialErrorFunc = null;
    this.handleDataInterval = null;
    this.connectSerial = this.connectSerial.bind(this);
    this.onInternalSerialConnected = this.onInternalSerialConnected.bind(this);
    this.onInternalSerialDisconnected = this.onInternalSerialDisconnected.bind(this);
    this.onInternalSerialError = this.onInternalSerialError.bind(this);
    this.onInternalSerialData = this.onInternalSerialData.bind(this);
    this.onDataFromDevice = this.onDataFromDevice.bind(this);
    this.startHandleDataInterval();
    /*========== Web Serial ==========*/

    /*========== Streaming web socket ==========*/
    this.streamingSocket = new WebSocketClient();
    this.onStreamingSocketDisconnected = this.onStreamingSocketDisconnected.bind(this);
    this.streamingSocket.onDisconnected(this.onStreamingSocketDisconnected);
    /*========== Streaming web socket ==========*/

    consoleTimeLog('===>>> DeviceInstance initialized, isUSB: ', this.isUSB);
  }

  startWaitingRequestConnectServerInterval() {
    clearInterval(this.waitingRequestConnectServerInterval);
    this.waitingRequestConnectServerInterval = setInterval(() => {
      if (!this.isTCPSocketOpened && !this.lostNetwork && !this.scanningBT) {
        consoleTimeLog(`===>>> ${this.deviceId} Waiting request connect server timeout`);
        this.sendSPRebootToDevice();
      }
    }, 20000);
  }

  /*========== Web Serial ==========*/
  closeSerial() {
    if (this.webSerial) {
      this.webSerial.close();
    }
  }

  async connectSerial(path) {
    consoleTimeLog(`===>>> Request connect serial: ${path} - ${this.deviceId}`);
    this.isUSB = true;
    this.webSerial = new WebSerial();
    this.listenSerialEvents();
    this.path = path;
    clearInterval(this.waitingConnectSerialTimeout);
    this.waitingConnectSerialTimeout = setTimeout(() => {
      if (this.onSerialErrorFunc) {
        this.onSerialErrorFunc(this.deviceId, 'Timeout');
      }
    }, 2000);
    await this.webSerial.connect(path);
  }

  // reconnectSerial(path) {
  //   consoleTimeLog(`===>>> Reconnect connect serial: ${path} - ${this.deviceId}`);
  //   this.path = path;
  //   clearInterval(this.waitingConnectSerialTimeout);
  //   this.waitingConnectSerialTimeout = setTimeout(() => {
  //     if (this.onSerialErrorFunc) {
  //       this.onSerialErrorFunc(this.deviceId, 'Timeout');
  //     }
  //   }, 2000);
  // }

  isSerialOpen() {
    return this.webSerial && this.webSerial.isOpen();
  }

  async getListDevice() {
    if (this.webSerial) {
      return await this.webSerial.getListDevice();
    }
    return [];
  }

  onInternalSerialConnected() {
    consoleTimeLog(
      `===>>> ${this.deviceId} Serial connected`,
      this.waitingConnectSerialTimeout,
    );
    clearTimeout(this.waitingConnectSerialTimeout);
    setTimeout(() => {
      consoleTimeLog(`===>>> ${this.deviceId} Send SynCmd`);
      this.sendPackageToDevice(SynCmd.request(), true);
    }, 200);

    if (this.onConnectedFunc) {
      this.onConnectedFunc(this.deviceId);
    }
  }

  onInternalSerialDisconnected() {
    consoleTimeLog(`===>>> ${this.deviceId} Serial disconnected`);
    this.close();
    if (this.onDisconnectFunc) {
      this.onDisconnectFunc(this.deviceId);
    }
  }

  onInternalSerialError(error) {
    clearInterval(this.waitingConnectSerialTimeout);
    if (this.onSerialErrorFunc) {
      this.onSerialErrorFunc(this.deviceId, error);
    }
  }

  onInternalSerialData(data) {
    this.onDataFromDevice(data);
  }

  listenSerialEvents() {
    this.webSerial.onConnected(this.onInternalSerialConnected);
    this.webSerial.onData(this.onInternalSerialData);
  }

  onSerialError(callback) {
    this.onSerialErrorFunc = callback;
  }
  /*========== Web Serial ==========*/

  startHandleDataInterval() {
    clearInterval(this.handleDataInterval);
    this.handleDataInterval = setInterval(() => {
      try {
        if (!FrameHandler.isContainFrame(this.dataBuffer)) {
          return;
        }
        const frame = FrameHandler.extractFrameFromBuffer(this.dataBuffer);
        if (frame) {
          this.dataBuffer = ByteUtils.subByteArray(
            this.dataBuffer,
            frame.length,
            this.dataBuffer.length - frame.length,
          );
          this.handleFrameFromDevice(frame);
        }
      } catch (e) {
        consoleTimeLog(`${this.deviceId} startPayloadInterval --> INTERRUPT`);
        console.error(e);
      }
    }, 50);
  }

  onDataFromDevice(data) {
    if (data && data.length > 0) {
      try {
        this.dataBuffer = ByteUtils.concatenateTwoByteArray(this.dataBuffer, data);
      } catch (e) {
        consoleTimeLog(`${this.deviceId} startPayloadInterval --> INTERRUPT`);
        console.error(e);
      }
    }
  }

  onStreamingSocketDisconnected() {
    consoleTimeLog(`===>>> ${this.deviceId} onStreamingSocketDisconnected`);
    this.sendStopStreamingECGToDevice();
  }

  resetState() {
    this.scanningBT = false;
    this.randomKey = '';
    this.schemaVersion = 0;
    this.networkAdapterType = null;
    this.sequenceNumber = 0;
    this.deviceSequenceNumber = 0;
    this.connectionState = 0;
    this.handleTCPBufferInterval = null;
    this.dataBuffer = [];
    this.tcpDataBuffer = [];
    this.isTCPSocketOpened = false;
  }

  handleFrameFromDevice = (data) => {
    consoleTimeLog(`===>>> ${this.deviceId} Before FrameHandler handle`, {
      hexData: ByteUtils.toHexString(data),
      currentDeviceSequenceNumber: this.deviceSequenceNumber,
      sequenceNumberFromFrame: FrameHandler.getSequenceNumber(data),
      packLength: data.length - 8,
    });
    FrameHandler.handle(
      this.deviceId,
      this.deviceSequenceNumber,
      data,
      (success, newDeviceSequenceNumber, packages) => {
        consoleTimeLog(`===>>> ${this.deviceId} FrameHandler handled`, {
          success,
          newDeviceSequenceNumber,
        });
        if (success) {
          this.deviceSequenceNumber = newDeviceSequenceNumber;
          PackageHandler.handle(this, packages);
        } else {
          // this.close();
          if (this.onDisconnectFunc) {
            this.onDisconnectFunc(this.deviceId);
          }
        }
      },
    );
  };

  startDisconnectProcess() {
    try {
      this.connectionState = ConnectionState.DISCONNECTING;
      // consoleTimeLog(`===>>> ${this.deviceId} Send SmNWADAPTER BT`);
      // this.sendPackageToDevice(SmNWADAPTER.request(NetworkAdapterType.BT));
    } catch (e) {
      console.error(e); // JavaScript uses console.error to print errors
    }
  }

  unexpectedDisconnect() {
    this.connectionState = ConnectionState.DISCONNECTED;
    this.close();
    if (this.onDisconnectFunc) {
      this.onDisconnectFunc();
    }
  }

  close() {
    clearTimeout(this.kaTimeout);
    // this.selfCloseTCPSocket();
    if (this.webSerial) {
      this.webSerial.close();
    }
    // if (this.webBluetooth) {
    //   this.webBluetooth.disconnect();
    // }
    this.clearInterval();
    this.resetState();
  }

  selfClose() {
    clearTimeout(this.kaTimeout);
    setTimeout(() => {
      this.close();
    }, 1000);
  }

  handleWaitingExportStartStatus = () => {
    if (this.timeWaitingExportStartStatus >= this.maxTimeWaitingExportStartStatus) {
      clearInterval(this.exportStartInterval);
      // Callback error func to web
      return;
    }
    consoleTimeLog(
      `===>>> ${this.timeWaitingExportStartStatus + 1}, Export start timeout`,
    );
    this.timeWaitingExportStartStatus += 1;
    this.sendPackageToDevice(SynCmd.request(), true);
  };

  onSynComplete = () => {
    this.connectionState = ConnectionState.SYN_SUCCESS;
    consoleTimeLog(`===>>> ${this.deviceId} Send SmID`);

    this.sendPackageToDevice(SmID.request());
    if (!this.exportStartInterval) {
      this.exportStartInterval = setInterval(() => {
        this.handleWaitingExportStartStatus();
      }, 5000);
    }
  };

  onExportCompleted() {
    consoleTimeLog(`===>>> ${this.deviceId} onExportCompleted`);
    clearInterval(this.exportStartInterval);
    setTimeout(() => {
      this.sendPackageToDevice(SmStudy.request());
    }, 100);
  }

  getStudyStartStatus(data) {
    consoleTimeLog(`===>>> ${this.deviceId} getStudyStartStatus`, data);
    this.sendPackageToDevice(SmMass.request());
  }

  showPublicPartition() {
    consoleTimeLog(`===>>> ${this.deviceId} showPublicPartition`);
  }

  onGetIdComplete(success) {
    consoleTimeLog(`===>>> ${this.deviceId} onGetIdComplete`, {
      success,
      connectionState: this.connectionState,
    });
    if (!success) {
      this.startDisconnectProcess();
      return;
    }
    if (this.onDeviceIdFunc) {
      this.onDeviceIdFunc(this.path, this.deviceId);
    }
    // Assuming connectionState is a variable accessible in this context
    if (this.connectionState === ConnectionState.SYN_SUCCESS) {
      if (this.isUSB) {
        consoleTimeLog(
          `===>>> ${this.deviceId} Send SmNWADAPTER USB with token`,
          this.deviceKey,
        );
        this.sendPackageToDevice(SmNWADAPTER.request(NetworkAdapterType.USB));
      }
      this.startWaitingRequestConnectServerInterval();
      // callback.usbSynDone(this); // Note: 'this' context in JavaScript might differ from Kotlin, ensure correct context is used or adapted
    } else {
      // this.startDisconnectProcess();
    }
  }

  buildKaFrame() {
    const currentSequenceNumber = this.sequenceNumber;
    const dataToSend = SmKA.request();
    const kaFrame = FrameBuilder.usbBuildFrame(this.sequenceNumber, [dataToSend]);
    this.sequenceNumber = FrameUtils.calculateSequenceNumber(
      this.sequenceNumber,
      dataToSend.length,
    );
    return { kaFrame, currentSequenceNumber };
  }

  sendSPRebootToDevice = () => {
    consoleTimeLog(`===>>> ${this.deviceId} Send SmSPREBOOT`);
    this.sendPackageToDevice(SmSPREBOOT.request());
  };

  sendKaRightWay = () => {
    this.handleSendKa();
    const { kaFrame, currentSequenceNumber } = this.buildKaFrame();
    consoleTimeLog(`===>>> ${this.deviceId} sendPackageToDevice KaRightWay`, {
      currentSequenceNumber,
      sequenceNumber: this.sequenceNumber,
      isUSB: this.isUSB,
    });
    if (this.isUsbConnectionEstablished() && this.isUSB) {
      this.webSerial.write(kaFrame);
    } else {
      this.btWriteToDeviceBuffer.push({ isCredit: false, frame: kaFrame });
    }
  };

  sendStartStreamingECGToDevice = () => {
    consoleTimeLog(`===>>> ${this.deviceId} sendStartStreamingECGToDevice`);
    this.sendPackageToDevice(SmUECG.request(true));
    if (this.streamingSocket !== null) {
      consoleTimeLog(`===>>> ${this.deviceId} Request connect streaming socket`);
      this.streamingSocket.connect(this.deviceId);
    }
  };

  sendStopStreamingECGToDevice = () => {
    consoleTimeLog(`===>>> ${this.deviceId} sendStopStreamingECGToDevice`);
    this.sendPackageToDevice(SmUECG.request(false));
  };

  handleSendKa = () => {
    clearTimeout(this.kaTimeout);
    this.kaTimeout = setTimeout(() => {
      const { kaFrame, currentSequenceNumber } = this.buildKaFrame();
      consoleTimeLog(`===>>> ${this.deviceId} sendPackageToDevice KA`, {
        currentSequenceNumber,
        sequenceNumber: this.sequenceNumber,
        isUSB: this.isUSB,
      });
      if (this.isUsbConnectionEstablished() && this.isUSB) {
        this.webSerial.write(kaFrame);
      } else {
        this.btWriteToDeviceBuffer.push({ isCredit: false, frame: kaFrame });
      }
      this.handleSendKa();
    }, 5000);
  };

  sendPackageToDevice(pack, isSyn = false) {
    this.handleSendKa();
    const currentSequenceNumber = this.sequenceNumber;
    const frame = isSyn
      ? FrameBuilder.usbBuildSynFrame([pack])
      : FrameBuilder.usbBuildFrame(this.sequenceNumber, [pack]);
    if (!isSyn) {
      this.sequenceNumber = FrameUtils.calculateSequenceNumber(
        this.sequenceNumber,
        pack.length,
      );
    }

    consoleTimeLog(`===>>> ${this.deviceId || this.path} sendPackageToDevice`, {
      hex: ByteUtils.toHexString(frame),
      isSyn,
      currentSequenceNumber,
      sequenceNumber: this.sequenceNumber,
      isUSB: this.isUSB,
    });
    if (this.isUSB) {
      this.webSerial.write(frame);
    } else {
      this.btWriteToDeviceBuffer.push({ isCredit: false, frame });
    }
  }

  onUpdateECGConfig(ecgConfig) {
    consoleTimeLog(`===>>> ${this.deviceId} onUpdateECGConfig`, ecgConfig);
    this.ecgConfig = ecgConfig;
  }

  onChangeNetworkAdapterComplete(success) {
    if (!success) {
      this.startDisconnectProcess();
      return;
    }

    switch (this.connectionState) {
      case ConnectionState.SYN_SUCCESS:
        if (this.isUsbConnectionEstablished()) {
          this.connectionState = ConnectionState.CONNECTED;
          if (this.onConnectedUsbFunc) {
            this.onConnectedUsbFunc(this.deviceId, ConnectionState.CONNECTED);
          }
        }
        break;

      case ConnectionState.DISCONNECTING:
        break;

      default:
      // this.startDisconnectProcess();
    }
  }

  isUsbConnectionEstablished() {
    return this.networkAdapterType === NetworkAdapterType.USB;
  }

  isUsbConnection() {
    return true;
  }

  clearTcpBuffer() {
    this.tcpDataBuffer = [];
  }

  onModemRebootComplete(success) {
    this.unexpectedDisconnect('ModemReboot');
  }

  onUpdateDeviceInfo(deviceInfo) {
    consoleTimeLog(`===>>> ${this.deviceId} onUpdateDeviceInfo`, deviceInfo);
    if (this.onDeviceInfoFunc) {
      this.onDeviceInfoFunc(this.deviceId, deviceInfo);
    }
  }

  onDeviceId(callback) {
    this.onDeviceIdFunc = callback;
  }

  onDeviceInfo(callback) {
    this.onDeviceInfoFunc = callback;
  }

  onDisconnect(callback) {
    this.onDisconnectFunc = callback;
  }

  onConnected(callback) {
    this.onConnectedFunc = callback;
  }

  onConnectedUsb(callback) {
    this.onConnectedUsbFunc = callback;
  }

  onBluetoothError(callback) {
    this.onErrorBTFunc = callback;
  }

  clearInterval() {
    clearInterval(this.handleTCPBufferInterval);
    clearInterval(this.btWriteToDeviceInterval);
    clearTimeout(this.kaTimeout);
    clearInterval(this.waitingRequestConnectServerInterval);
    clearInterval(this.waitingConnectSerialTimeout);
  }
}
