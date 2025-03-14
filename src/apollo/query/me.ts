import { gql } from '@apollo/client';

const ME_QUERY = gql`
  query me {
    me {
      id
      firstName
      lastName
      contact {
        phone1
      }
      username
      email
      isDisabled
      roles
      freshChatRestoreId
      willViewTutorialLater
      canUseAiViewer
      isTestAccount
      photo
      isEmailVerified
    }
  }
`;

export default ME_QUERY;
