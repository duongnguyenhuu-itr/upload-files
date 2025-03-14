import { ICountryQuery } from '@/apollo/functions/fetchCountry';
import { IUserQuery } from '@/apollo/functions/function';
import { TLeaveSite } from '@/store/leaveSiteSlice';

export const initialState = {
  authentication: {
    isLoading: true,
    isLogin: false,
  },
  me: {} as IUserQuery,
  country: [] as ICountryQuery[],
  facilities: [] as { label: string; value: string; status: string }[],
  selectedFacility: 'all',
  leaveSite: {} as TLeaveSite,
};

export type TInitialState = typeof initialState;
