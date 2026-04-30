import { create } from 'zustand';
import type { Inputs } from '../engine/calculator';
import type { CategoryKey } from '../data/apartments';

export type AppState = Inputs & {
  preferCategory: CategoryKey;
  preferRegions: string[];     // region codes; [] = 전체
};

const todayMinus30 = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 32);
  return d.toISOString().slice(0, 10);
};

export const initialState: AppState = {
  birthday: '',
  isMarried: null as any,       // 기본 상태를 위해 null 지정
  isNewCouple: null as any,
  hasNewBorn2yr: null as any,
  isDualIncome: null as any,
  isFirstTime: null as any,
  isNoHouse: null as any,
  yearIncome: '' as any,        // 0 대신 비워두어 placeholder가 보이게 함
  myAsset: '' as any,
  monthlySaving: '' as any,
  borrowingYear: 30,
  paymentType: 'fixed',
  kidsCount: 0,
  isHavingKids: false,
  isSingleParent: false,
  isMultiCultural: false,
  isDisabled: false,
  preferCategory: 'station',
  preferRegions: [],
};

type Store = AppState & {
  set: <K extends keyof AppState>(key: K, val: AppState[K]) => void;
  hydrate: (s: Partial<AppState>) => void;
  reset: () => void;
};

export const useAppStore = create<Store>((set) => ({
  ...initialState,
  set: (key, val) => set({ [key]: val } as any),
  hydrate: (s) => set(s),
  reset: () => set(initialState),
}));
