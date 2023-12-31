import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PermissionType } from "../types/shared"

interface BearState {
  permissions: string[]
  setPermissions: (e: PermissionType[] | undefined) => void
}

export const useAppStore = create<BearState>()(
  persist(
    (set) => ({
      permissions: [],
      setPermissions: (payload) =>
        set({ permissions: payload ? payload.map((el) => el.name) :[] }),
    }),
    {
      name: "app-storage",
    }
  )
)
