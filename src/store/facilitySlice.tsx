import { initialState, TInitialState } from '@/store/initialState';
import { StateCreator } from 'zustand';

type TInitFacility = TInitialState['facilities'];

export interface IFacility extends Pick<TInitialState, 'facilities'> {
  setFacilities: (meData: TInitFacility) => void;
}

const facilitySlice: StateCreator<IFacility> = (set) => ({
  facilities: initialState.facilities,
  setFacilities: (facilities: TInitFacility) =>
    set(() => ({
      facilities,
    })),
});

export default facilitySlice;
