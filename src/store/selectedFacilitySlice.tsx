import { initialState, TInitialState } from '@/store/initialState';
import { StateCreator } from 'zustand';

type TInitSelectedFacility = TInitialState['selectedFacility'];

export interface ISelectedFacility extends Pick<TInitialState, 'selectedFacility'> {
  setSelectedFacility: (facilityId: TInitSelectedFacility) => void;
}

const selectedFacilitySlice: StateCreator<ISelectedFacility> = (set) => ({
  selectedFacility: initialState.selectedFacility,
  setSelectedFacility: (facilityId: TInitSelectedFacility) =>
    set(() => ({
      selectedFacility: facilityId,
    })),
});

export default selectedFacilitySlice;
