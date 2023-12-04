import { create } from "zustand";

interface state {
  overlayStatu: boolean;
  toggleOverlayStatu: () => void;
  loading: boolean;
  toggleLoading: (e: boolean) => void;
}

const useOverlay = create<state>((set, get) => ({
  overlayStatu: false,
  loading: false,
  toggleOverlayStatu() {
    set((pre) => ({
      ...pre,
      overlayStatu: !pre.overlayStatu,
    }));
  },
  toggleLoading(e) {
    set((pre) => ({
      ...pre,
      loading: e,
    }));
  },
}));

export default useOverlay;
