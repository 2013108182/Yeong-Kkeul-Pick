import { create } from 'zustand';
import type { Inputs } from '../engine/calculator';
import type { CategoryKey } from '../data/apartments';

export type AppState = Inputs & {
  preferCategory: CategoryKey;
  preferRegions: string[];
};

export const initialState: AppState = {
  birthday:       '',
  isMarried:      false,
  isNewCouple:    false,
  hasNewBorn2yr:  false,
  isDualIncome:   false,
  isFirstTime:    false,
  isNoHouse:      false,
  yearIncome:     0,   // 만원. 0이면 입력 안 한 것
  myAsset:        0,   // 만원
  monthlySaving:  0,   // 만원
  borrowingYear:  30,
  paymentType:    'fixed',
  kidsCount:      0,
  isHavingKids:   false,
  isSingleParent: false,
  isMultiCultural:false,
  isDisabled:     false,
  preferCategory: 'station',
  preferRegions:  [],
};

type Store = AppState & {
  set: <K extends keyof AppState>(key: K, val: AppState[K]) => void;
  hydrate: (s: Partial<AppState>) => void;
  reset: () => void;
};

export const useAppStore = create<Store>((set) => ({
  ...initialState,
  set:     (key, val) => set({ [key]: val } as Partial<AppState>),
  hydrate: (s)        => set(s),
  reset:   ()         => set(initialState),
}));
