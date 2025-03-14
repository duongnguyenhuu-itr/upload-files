import client from '@/apollo';
import { ICountryCodesInput } from '@/apollo/functions/function';
import COUNTRIES_QUERY from '@/apollo/query/countries';

export interface ICountryQuery {
  name: string;
  alpha2: string;
  dial: string;
  label?: string;
}

export interface ICountryResponse {
  countryCodes: {
    countryCodes: ICountryQuery[] | null;
  };
}

const fetchCountry = async (payload: ICountryCodesInput) => {
  const result = await client.query<ICountryResponse>({
    query: COUNTRIES_QUERY,
    variables: payload,
  });
  return result.data.countryCodes.countryCodes;
};

export default fetchCountry;
