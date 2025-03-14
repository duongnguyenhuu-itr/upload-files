import { gql } from '@apollo/client';

const SEND_DEVICE_CONNECTION_STATUS_QUERY = gql`
  query sendDeviceConnectionStatus($input: LiveEcgInput!) {
    sendDeviceConnectionStatus(input: $input) {
      isSuccess
      message
    }
  }
`;

export default SEND_DEVICE_CONNECTION_STATUS_QUERY;
