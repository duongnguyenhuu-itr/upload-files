import { initialState, TInitialState } from '@/store/initialState';
import { StateCreator } from 'zustand';

type TInitLeaveSite = TInitialState['leaveSite'];

export interface ILeaveSite extends Pick<TInitialState, 'leaveSite'> {
  setLeaveSite: (facilityId: TInitLeaveSite) => void;
}

export type TLeaveSite = {
  isUnsaved?: boolean;
  isShowLeaveModal?: boolean;
  isFromBrowserBackButton?: boolean;
  callback?: () => void;
};

const leaveSiteSlice: StateCreator<ILeaveSite> = (set) => ({
  leaveSite: initialState.leaveSite,
  setLeaveSite: (facilityId: TInitLeaveSite) =>
    set(() => ({
      leaveSite: facilityId,
    })),
});

export default leaveSiteSlice;
