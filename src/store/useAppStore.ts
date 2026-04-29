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
  birthday: todayMinus30(),
  isMarried: true,
  isNewCouple: false,
  hasNewBorn2yr: false,
  isDualIncome: true,
  isFirstTime: true,
  isNoHouse: true,
  yearIncome: 9000,
  myAsset: 30000,         // 만원 (3억)
  monthlySaving: 200,
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
