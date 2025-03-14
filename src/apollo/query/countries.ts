import { gql } from '@apollo/client';

const COUNTRIES_QUERY = gql`
  query countryCodes($filter: CountryCodesFilter!, $pagination: PaginationInput) {
    countryCodes(filter: $filter, pagination: $pagination) {
      countryCodes {
        name
        alpha2
        dial
      }
    }
  }
`;
export default COUNTRIES_QUERY;
