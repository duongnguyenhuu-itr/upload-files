import client from '@/apollo';
import SYNC_DEVICE_DATA from '@/apollo/mutate/syncDeviceData';

export interface IStyncDeviceDataPayload {
  input: {
    deviceId?: string;
    studyId?: string;
    url: string;
  };
}

export interface IStyncDeviceDataResponse {
  syncDeviceData: {
    isSuccess: boolean;
    message: string;
  };
}
const handleSyncDeviceData = async (payload: IStyncDeviceDataPayload) => {
  const result = await client.mutate<IStyncDeviceDataResponse>({
    mutation: SYNC_DEVICE_DATA,
    variables: payload,
  });
  return result.data.syncDeviceData;
};

export default handleSyncDeviceData;
