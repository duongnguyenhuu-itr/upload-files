import { IUserQuery } from '@/apollo/functions/function';
import { initialState, TInitialState } from '@/store/initialState';
import { StateCreator } from 'zustand';

type TInitMe = TInitialState['me'];

export interface IMe extends Pick<TInitialState, 'me'> {
  setMe: (meData: Partial<TInitMe>) => void;
}

const meSlice: StateCreator<IMe> = (set) => ({
  me: { ...initialState.me },
  setMe: (meData: Partial<IUserQuery>) =>
    set((state) => ({
      me: {
        ...state.me,
        ...meData,
      },
    })),
});

export default meSlice;
