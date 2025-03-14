import { initialState, TInitialState } from '@/store/initialState';
import { StateCreator } from 'zustand';

type TInitCountry = TInitialState['country'];

export interface ICountry extends Pick<TInitialState, 'country'> {
  setCountry: (meData: TInitCountry) => void;
}

const countrySlice: StateCreator<ICountry> = (set) => ({
  country: initialState.country,
  setCountry: (countryData: TInitCountry) =>
    set(() => ({
      country: countryData,
    })),
});

export default countrySlice;
