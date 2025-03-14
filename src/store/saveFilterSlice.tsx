import { TRadioDateRangeValue } from '@/components/radioDateRange';
import { initialState, TInitialState } from '@/store/initialState';
import { Dayjs } from 'dayjs';
import { StateCreator } from 'zustand';

export type TPatientFilter = {
  filters?: {
    status?: string[] | null;
  };
  currentPage?: number;
  pageSize?: number;
  searchTypeKey?: string;
  search?: string;
};

export type TAppointmentFilter = {
  dateRange?: TRadioDateRangeValue;
  selectedDate?: Dayjs | null;
};

export type TSaveFilter = {
  patient?: TPatientFilter;
  appointment?: TAppointmentFilter;
};

type TInitSaveFilter = TInitialState['saveFilter'];

export interface ISaveFilter extends Pick<TInitialState, 'saveFilter'> {
  setSaveFilter: (filter: TInitSaveFilter) => void;
  resetSaveFilter: () => void;
}

const saveFilterSlice: StateCreator<ISaveFilter> = (set) => ({
  saveFilter: initialState.saveFilter,
  setSaveFilter: (filter: TInitSaveFilter) =>
    set((state) => ({
      saveFilter: {
        ...state.saveFilter,
        ...filter,
      },
    })),
  resetSaveFilter: () =>
    set(() => ({
      saveFilter: {},
    })),
});

export default saveFilterSlice;
