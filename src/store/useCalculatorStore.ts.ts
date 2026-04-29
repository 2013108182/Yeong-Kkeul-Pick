import { create } from 'zustand';
import { Inputs, calcAllCases, CaseResult, CaseKey } from '../lib/calculator';
import { curateApartments, Apartment, CategoryKey } from '../data/apartments';

interface CalculatorState {
  // UI 상태
  step: number;
  
  // 사용자 입력 상태
  inputs: Inputs;
  preferCategory: CategoryKey;
  preferRegions: string[];
  
  // 결과 상태
  results: Record<CaseKey, CaseResult> | null;
  curatedApts: Apartment[];
  
  // 액션
  nextStep: () => void;
  prevStep: () => void;
  updateInput: <K extends keyof Inputs>(key: K, value: Inputs[K]) => void;
  setPreferences: (category: CategoryKey, regions: string[]) => void;
  calculateAndFinish: () => void;
  reset: () => void;
}

const initialInputs: Inputs = {
  birthday: '1996-01-01',
  isMarried: false,
  isNewCouple: false,
  hasNewBorn2yr: false,
  isDualIncome: false,
  isFirstTime: true,
  isNoHouse: true,
  yearIncome: 5000,
  myAsset: 10000,
  monthlySaving: 150,
  borrowingYear: 30,
  paymentType: 'fixed',
  kidsCount: 0,
  isHavingKids: false,
  isSingleParent: false,
  isMultiCultural: false,
  isDisabled: false,
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  step: 1,
  inputs: initialInputs,
  preferCategory: 'station',
  preferRegions: [],
  results: null,
  curatedApts: [],

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  updateInput: (key, value) => 
    set((state) => ({ inputs: { ...state.inputs, [key]: value } })),
    
  setPreferences: (category, regions) =>
    set(() => ({ preferCategory: category, preferRegions: regions })),

  calculateAndFinish: () => {
    const state = get();
    // 1. 3케이스 영끌 계산 엔진 구동
    const calcResults = calcAllCases(state.inputs);
    
    // 2. 비토허제 기준 최대 예산으로 아파트 큐레이션 (가장 넉넉한 예산 기준)
    const maxBudget = calcResults.NON_REGULATED.maxPropertyPrice;
    const curated = curateApartments({
      budget: maxBudget,
      category: state.preferCategory,
      regionCodes: state.preferRegions.length > 0 ? state.preferRegions : undefined,
    });

    set({ results: calcResults, curatedApts: curated, step: 4 });
  },

  reset: () => set({ step: 1, inputs: initialInputs, results: null, curatedApts: [] }),
}));