import { create } from 'zustand';
import { CrudStateInterface } from '../interfaces/crud-state.interface';

export const useCrudStore = create<CrudStateInterface>((set) => ({
  isApprovedOrRejected: 0,
  isEditedOrDeletedOrAdded: 0,
  incrementApprovedOrRejected: () => {
    set((prev) => ({
      isApprovedOrRejected: prev.isApprovedOrRejected + 1,
    }));
  },
  incrementEditedOrDeletedOrAdded: () => {
    set((prev) => ({
      isEditedOrDeletedOrAdded: prev.isEditedOrDeletedOrAdded + 1,
    }));
  },
}));
