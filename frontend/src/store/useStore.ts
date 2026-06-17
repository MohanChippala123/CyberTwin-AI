import { create } from 'zustand'
import { Company, Asset, AttackPath } from '../api/client'

interface AppStore {
  currentCompany: Company | null
  assets: Asset[]
  attackPaths: AttackPath[]
  chatSessionId: string | null
  loading: boolean
  error: string | null

  setCurrentCompany: (company: Company | null) => void
  setAssets: (assets: Asset[]) => void
  setAttackPaths: (paths: AttackPath[]) => void
  setChatSessionId: (sessionId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useStore = create<AppStore>((set) => ({
  currentCompany: null,
  assets: [],
  attackPaths: [],
  chatSessionId: null,
  loading: false,
  error: null,

  setCurrentCompany: (company) => set({ currentCompany: company }),
  setAssets: (assets) => set({ assets }),
  setAttackPaths: (paths) => set({ attackPaths: paths }),
  setChatSessionId: (sessionId) => set({ chatSessionId: sessionId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
