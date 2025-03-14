import fetchStudy from '@/apollo/functions/fetchStudy';
import CustomProgress from '@/components/customProgress';
import { EMITTER_CONSTANTS } from '@/constants';
import { DeviceInstance } from '@/libs/deviceProtocol/deviceInstance';
import {
  DEVICE_EXAMPLE_INFO,
  LoadingStatus,
} from '@/pages/home/layout/deviceCard/constant';
import { DeviceFiles, LookupTable } from '@/pages/home/layout/deviceCard/deviceCard';
import {
  formatFolder,
  handleSyncMissingData,
  handleUploadFilesToS3,
} from '@/pages/home/layout/deviceCard/deviceCard.h';
import FolderUpload from '@/pages/home/layout/deviceCard/layout/folderUpload';
import { DeviceStatus } from '@/pages/home/layout/deviceManager/constant';
import { Device } from '@/pages/home/layout/deviceManager/deviceManager.d';
import { useEmitter, useSetState } from '@/utils/customHook';
import appLocalStorage from '@/utils/localStorage';
import staticSocket from '@/utils/socketIo';
import { Button, Flex } from 'antd';
import { t } from 'i18next';
import { useEffect, useMemo, useRef } from 'react';
import './deviceCard.s.scss';
interface IProps {
  deviceInfo: Device;
  onDisconnect: () => void;
}

interface IState {
  files: File[];
  device: Device;
  facilityId: string;
  loadingStatus: LoadingStatus;
  formattedFiles: DeviceFiles | null;
  lookupTables: LookupTable;
  missingData: string[];
}

const DeviceCard = (props: IProps) => {
  const [state, setState] = useSetState<IState>({
    files: [],
    device: props.deviceInfo,
    facilityId: '',
    loadingStatus: LoadingStatus.INIT,
    formattedFiles: null,
    lookupTables: [],
    missingData: [],
  });
  const deviceRef = useRef<DeviceInstance | null>(null);
  const { deviceId, port, status } = state.device;
  const allowFolders = useMemo(() => [`OB${deviceId}`], [deviceId]);
  const progressStatus = useMemo(
    () =>
      state.loadingStatus === LoadingStatus.SUCCESS
        ? 'success'
        : state.loadingStatus === LoadingStatus.ERROR
        ? 'exception'
        : 'active',
    [state.loadingStatus],
  );

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setState({ loadingStatus: LoadingStatus.LOADING });
      const files = Array.from(e.target.files);
      const formattedFiles = formatFolder(files);
      console.log('Formatted files:', formattedFiles);
      setState({ formattedFiles });

      // Upload notification files and get lookup tables
      handleUploadFilesToS3({
        formattedFiles,
        deviceId: DEVICE_EXAMPLE_INFO.deviceId,
        studyId: DEVICE_EXAMPLE_INFO.studyId,
      });
    } catch (error) {
      console.log('Error reading file:', error);
      setState({ loadingStatus: LoadingStatus.ERROR });
    }
  };

  const getFacilityId = async () => {
    const study = await fetchStudy({ id: DEVICE_EXAMPLE_INFO.studyId });
    setState({ facilityId: study?.facility?.id });
  };

  const onConnectedUsb = async (deviceId: string, status: DeviceStatus) => {
    // console.log('Connected USB:', { deviceId, status });
    // const facilityId = await fetchStudy({ id: DEVICE_EXAMPLE_INFO.studyId });
    // console.log('Facility ID:', facilityId);
    setState({
      device: {
        ...state.device,
        status: DeviceStatus.CONNECTED,
        deviceId: DEVICE_EXAMPLE_INFO.deviceId,
        studyId: DEVICE_EXAMPLE_INFO.studyId,
      },
    });
    appLocalStorage.setDeviceId(
      `${port.getInfo().usbVendorId}_${port.getInfo().usbProductId}`,
      deviceId,
    );
  };

  const onDisconnect = () => {
    deviceRef.current?.selfClose();
    deviceRef.current?.close();
    setState({
      device: {
        ...state.device,
        status: DeviceStatus.INIT,
      },
    });
  };

  const onError = (deviceId: string, error: any) => {
    console.error('Error:', { deviceId, error });
  };

  const onConnect = async () => {
    try {
      const newDevice = new DeviceInstance(true);
      await newDevice.connectSerial(port.getInfo());
      deviceRef.current = newDevice;
      setState({
        device: {
          ...state.device,
          status: DeviceStatus.CONNECTING,
          deviceProtocol: newDevice,
        },
      });
    } catch (error) {
      console.error('Error opening serial port:', error);
    }
  };

  const handleSyncDeviceDataListener = async (data: any) => {
    const { deviceId, missingEcg, missingLog, receivedNotifications, studyId } =
      data || {};
    console.log('handleSyncDeviceDataListener', data);
    if (
      deviceId !== DEVICE_EXAMPLE_INFO.deviceId ||
      studyId !== DEVICE_EXAMPLE_INFO.studyId
    )
      return;
    try {
      if (!receivedNotifications) {
        handleUploadFilesToS3({
          formattedFiles: state.formattedFiles,
          deviceId: DEVICE_EXAMPLE_INFO.deviceId,
          studyId: DEVICE_EXAMPLE_INFO.studyId,
        });
        return;
      }
      const result = await handleSyncMissingData({
        missingEcg,
        missingLog,
        formattedFiles: state.formattedFiles,
        deviceId: DEVICE_EXAMPLE_INFO.deviceId,
        studyId: DEVICE_EXAMPLE_INFO.studyId,
      });
      if (result.isSuccess) {
        setState({ loadingStatus: LoadingStatus.SUCCESS });
      } else {
        setState({ loadingStatus: LoadingStatus.ERROR });
      }
    } catch (error) {
      console.log('Error sync device data:', error);
      setState({ loadingStatus: LoadingStatus.ERROR });
    }
  };

  const handleDisconnectListener = (event: any) => {
    const { usbVendorId: disconnectVendorId, usbProductId: disconnectProductId } =
      event.target.getInfo();
    const { usbVendorId, usbProductId } = port.getInfo();
    if (disconnectVendorId === usbVendorId && disconnectProductId === usbProductId) {
      deviceRef.current?.selfClose();
      deviceRef.current?.close();
      props.onDisconnect();
    }
  };

  useEffect(() => {
    if (deviceRef.current) {
      deviceRef.current.onSerialError(onError);
      deviceRef.current.onConnectedUsb(onConnectedUsb);
      deviceRef.current.onDisconnect(onDisconnect);
    }
  }, [state.device.deviceProtocol]);

  useEffect(() => {
    (navigator as any).serial.addEventListener('disconnect', handleDisconnectListener);
    return () => {
      (navigator as any).serial.removeEventListener(
        'disconnect',
        handleDisconnectListener,
      );
    };
  }, []);

  useEffect(() => {
    // Connect example
    if (!state.facilityId) {
      getFacilityId();
    } else {
      staticSocket.joinRoom(state.facilityId);
    }
  }, [state.facilityId]);

  useEmitter(EMITTER_CONSTANTS.SYNC_DEVICE_DATA, handleSyncDeviceDataListener, [
    state.formattedFiles,
  ]);

  return (
    <Flex className='device-card' vertical>
      <Flex vertical gap={16}>
        <Flex align='center' justify='space-between'>
          <p className='device-card-device-id'>{deviceId || t('newDevice')}</p>
          {status !== DeviceStatus.CONNECTED && (
            <Button
              type='primary'
              onClick={onConnect}
              loading={status === DeviceStatus.CONNECTING}
              ghost
            >
              {t('connect')}
            </Button>
          )}
          {status === DeviceStatus.CONNECTED &&
            state.loadingStatus !== LoadingStatus.SUCCESS && (
              <FolderUpload
                onFolderUpload={handleFolderUpload}
                allowFolders={allowFolders}
                loading={state.loadingStatus === LoadingStatus.LOADING}
              />
            )}
        </Flex>
        {status === DeviceStatus.CONNECTED &&
          state.loadingStatus !== LoadingStatus.INIT && (
            <CustomProgress
              timePerStep={200}
              step={2}
              maxPercentWaiting={70}
              status={progressStatus}
            />
          )}
      </Flex>
    </Flex>
  );
};

export default DeviceCard;
