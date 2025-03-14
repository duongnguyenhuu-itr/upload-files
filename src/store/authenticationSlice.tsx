import { initialState, TInitialState } from '@/store/initialState';
import { StateCreator } from 'zustand';

export interface IAuthentication extends Pick<TInitialState, 'authentication'> {
  setLoading: (boolean: boolean) => void;
  setAuthentication: (boolean: boolean) => void;
}

const authenticationSlice: StateCreator<IAuthentication> = (set) => ({
  authentication: {
    ...initialState.authentication,
  },
  setLoading: (isLoading) =>
    set((state) => ({
      authentication: {
        ...state.authentication,
        isLoading,
      },
    })),
  setAuthentication: (isLogin) =>
    set((state) => ({
      authentication: {
        ...state.authentication,
        isLogin,
      },
    })),
});

export default authenticationSlice;
