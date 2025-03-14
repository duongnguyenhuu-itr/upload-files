import { RemoveFunctions } from '@/model';
import authenticationSlice, { IAuthentication } from '@/store/authenticationSlice';
import countrySlice, { ICountry } from '@/store/countrySlice';
import facilitySlice, { IFacility } from '@/store/facilitySlice';
import selectedFacilitySlice, { ISelectedFacility } from '@/store/selectedFacilitySlice';
import saveFilterSlice, { ISaveFilter } from '@/store/saveFilterSlice';
import leaveSiteSlice, { ILeaveSite } from '@/store/leaveSiteSlice';
import { initialState } from '@/store/initialState';
import meSlice, { IMe } from '@/store/meSlice';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

type TStateCreate = IAuthentication &
  IMe &
  ICountry &
  IFacility &
  ISelectedFacility &
  ILeaveSite &
  ISaveFilter;

type TGlobalAction = {
  setGlobalState: (state: RemoveFunctions<Partial<TStateCreate>>) => void;
  resetGlobalState: () => void;
};

/*
Set multiple stores
Example:
Set isLoading and isLogin:

const setGlobalStateAction = useBoundStore(state => state.setGlobalState);

//Usage

setGlobalStateAction({
  authentication: {
    isLoading: true,
    isLogin: true
  },
  me: {
    ...meData
  }
})

*/
const globalAction: StateCreator<TGlobalAction> = (set) => ({
  setGlobalState: (stateUpdate) =>
    set((state) => ({
      ...state,
      ...stateUpdate,
    })),
  resetGlobalState: () =>
    set((state) => ({
      ...state,
      ...initialState,
    })),
});

const useBoundStore = create<TStateCreate & TGlobalAction>()(
  devtools(
    (...a) => ({
      ...globalAction(...a),
      ...authenticationSlice(...a),
      ...countrySlice(...a),
      ...meSlice(...a),
      ...facilitySlice(...a),
      ...selectedFacilitySlice(...a),
      ...saveFilterSlice(...a),
      ...leaveSiteSlice(...a),
    }),
    {
      name: 'ilr-storage',
      serialize: true,
    },
  ),
);

export default useBoundStore;
