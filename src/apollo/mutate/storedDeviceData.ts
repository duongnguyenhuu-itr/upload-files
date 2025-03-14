import { gql } from '@apollo/client';

const STORE_DEVICE_DATA = gql`
  mutation storeDeviceData($input: StoreDeviceDataInput) {
    storeDeviceData(input: $input) {
      isSuccess
      message
    }
  }
`;

export default STORE_DEVICE_DATA;
