import { gql } from '@apollo/client';

const STUDY_QUERY = gql`
  query study($id: ID!) {
    study(id: $id) {
      facility {
        id
      }
    }
  }
`;

export default STUDY_QUERY;
