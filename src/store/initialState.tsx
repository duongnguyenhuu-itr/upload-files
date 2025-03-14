import { ICountryQuery } from '@/apollo/functions/fetchCountry';
import { IMeQuery } from '@/apollo/functions/fetchMe';
import { TLeaveSite } from '@/store/leaveSiteSlice';
import { TSaveFilter } from '@/store/saveFilterSlice';

export const initialState = {
  authentication: {
    isLoading: true,
    isLogin: false,
  },
  me: {} as IMeQuery,
  country: [] as ICountryQuery[],
  facilities: [] as { label: string; value: string; status: string }[],
  selectedFacility: 'all',
  saveFilter: {} as TSaveFilter,
  leaveSite: {} as TLeaveSite,
};

export type TInitialState = typeof initialState;
