import client from '@/apollo';
import SEND_DEVICE_CONNECTION_STATUS_QUERY from '@/apollo/query/sendDeviceConnectionStatus';

export interface ISendDeviceConnectionStatusQuery {
  input: {
    isConnecting: boolean;
    deviceId: string;
  };
}

export interface ISendDeviceConnectionStatusResponse {
  sendDeviceConnectionStatus: {
    isSuccess: boolean;
    message: string;
  };
}
const handleSendDeviceConnectionStatus = async (
  input: ISendDeviceConnectionStatusQuery,
) => {
  const result = await client.query<ISendDeviceConnectionStatusResponse>({
    query: SEND_DEVICE_CONNECTION_STATUS_QUERY,
    variables: input,
  });
  return result.data.sendDeviceConnectionStatus;
};

export default handleSendDeviceConnectionStatus;
