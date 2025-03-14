import { gql } from '@apollo/client';

const SYNC_DEVICE_DATA = gql`
  mutation syncDeviceData($input: SyncDeviceDataInput) {
    syncDeviceData(input: $input) {
      isSuccess
      message
    }
  }
`;

export default SYNC_DEVICE_DATA;
