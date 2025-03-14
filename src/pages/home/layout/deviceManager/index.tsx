import CustomButton from '@/components/button';
import DeviceCard from '@/pages/home/layout/deviceCard';
import {
  DeviceStatus,
  PORT_INFO_OCTO_DEVICES,
} from '@/pages/home/layout/deviceManager/constant';
import { Device, PortInfo } from '@/pages/home/layout/deviceManager/deviceManager.d';
import { getKeyDevice } from '@/pages/home/layout/deviceManager/deviceManager.h';
import { ConnectDeviceIcon } from '@/static/svg';
import { useSetState } from '@/utils/customHook';
import { toastWarning } from '@/utils/toastNotification';
import { Flex } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect } from 'react';
interface IState {
  connectedDevices: Device[];
}

// Extend the Navigator interface to include the serial property
declare global {
  interface Navigator {
    serial: {
      getPorts: () => Promise<any[]>;
      requestPort: (options: { filters: PortInfo[] }) => Promise<any>;
      addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
      ) => void;
      removeEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
      ) => void;
    };
  }
}

const EXAMPLE_DEVICE = {
  port: null,
  deviceId: '123456789',
  status: DeviceStatus.CONNECTED,
};

const DeviceManager = () => {
  const [state, setState] = useSetState<IState>({
    connectedDevices: [],
  });

  const getConnectedDevice = async (filters: PortInfo[]) => {
    try {
      // Get all serial ports the user has previously granted the website access to.
      const ports = await navigator.serial.getPorts();

      // Filter ports based on vendorId and productId
      const filteredPorts = (ports || []).filter((port) => {
        const { usbVendorId } = port.getInfo();
        return filters.some((filter) => filter.usbVendorId === usbVendorId);
      });

      setState({
        connectedDevices: filteredPorts.map(
          (item): Device => ({
            port: item,
            deviceId: getKeyDevice(item),
            // status: DeviceStatus.INIT,
            status: DeviceStatus.CONNECTED,
          }),
        ),
      });
      // setState({
      //   connectedDevices: [EXAMPLE_DEVICE],
      // });
    } catch (error) {
      console.error('Error getting serial ports:', error);
      return [];
    }
  };

  const handleConnectNewDevice = async () => {
    try {
      if ('serial' in navigator) {
        const port = await navigator.serial.requestPort({
          filters: PORT_INFO_OCTO_DEVICES,
        });
        const { usbVendorId, usbProductId } = port.getInfo();
        const isExist = state.connectedDevices.some(
          (device) =>
            device.port.getInfo().usbVendorId === usbVendorId &&
            device.port.getInfo().usbProductId === usbProductId,
        );
        if (isExist) {
          toastWarning('This device is already connected.');
          return;
        }
        const newDevice = {
          port,
          deviceId: getKeyDevice(port),
          status: DeviceStatus.INIT,
        };
        setState({
          connectedDevices: [...state.connectedDevices, newDevice],
        });
      }
    } catch (error) {
      console.error('Error connecting new device:', error);
    }
  };

  const handleConnectListener = () => {
    getConnectedDevice(PORT_INFO_OCTO_DEVICES);
  };

  useEffect(() => {
    if ('serial' in navigator) {
      navigator.serial.addEventListener('connect', handleConnectListener);
      getConnectedDevice(PORT_INFO_OCTO_DEVICES);
      return () => {
        navigator.serial.removeEventListener('connect', handleConnectListener);
      };
    }
  }, []);

  const forgetPort = async () => {
    try {
      const ports = await navigator.serial.getPorts();
      const promises = ports.map((port) => port.forget());
      await Promise.all(promises);
      setState({ connectedDevices: [] });
    } catch (error) {
      console.error('Error closing serial port:', error);
    }
  };

  return (
    <Flex className='device-manager' vertical gap={20} align='center'>
      <button onClick={forgetPort}>Close</button>
      {state.connectedDevices.length === 0 ? (
        <>
          <CustomButton onClick={handleConnectNewDevice} type='primary'>
            {t('addNewDevice')}
          </CustomButton>
          <Flex
            className='home-connect-device'
            vertical
            align='center'
            justify='center'
            gap={20}
          >
            <img src={ConnectDeviceIcon} alt='' />
            <p>{t('Connect the device to your computer')}</p>
          </Flex>
        </>
      ) : (
        state.connectedDevices.map((device: Device, index) => (
          <DeviceCard
            key={device.deviceId || `${dayjs().valueOf()}${index}`}
            deviceInfo={device}
            onDisconnect={() => getConnectedDevice(PORT_INFO_OCTO_DEVICES)}
          />
        ))
      )}
    </Flex>
  );
};

export default DeviceManager;
