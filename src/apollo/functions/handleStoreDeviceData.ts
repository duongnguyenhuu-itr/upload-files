import client from '@/apollo';
import STORE_DEVICE_DATA from '@/apollo/mutate/storedDeviceData';

export type StoreData = {
  timeStart: number;
  timeStop: number;
  byteStart: number;
  byteStop: number;
};

export type FileDeviceType = 'notification' | 'ecg' | 'log' | 'acc';

export interface IStoreDeviceDataPayload {
  input: {
    deviceId?: string;
    studyId?: string;
    type: FileDeviceType;
    url: string;
    mssingHourlys?: StoreData[];
  };
}

export interface IStoreDeviceDataResponse {
  storeDeviceData: {
    isSuccess: boolean;
    message: string;
  };
}
const handleStoreDeviceData = async (payload: IStoreDeviceDataPayload) => {
  const result = await client.mutate<IStoreDeviceDataResponse>({
    mutation: STORE_DEVICE_DATA,
    variables: payload,
  });
  return result.data.storeDeviceData;
};

export default handleStoreDeviceData;
