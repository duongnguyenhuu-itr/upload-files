export interface IUserUpdated {
  id?: string;
  addNewFacilities?: Array<string>;
  removeFacilities?: Array<string>;
  isDisabled?: boolean;
  facility?: {
    id?: string;
    status?: string;
  };
  [any]?: any;
}
