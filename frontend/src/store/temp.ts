import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useBearStore = create();
