export interface CrudStateInterface {
  isApprovedOrRejected: number;
  incrementApprovedOrRejected: () => void;
  isEditedOrDeletedOrAdded: number;
  incrementEditedOrDeletedOrAdded: () => void;
}
