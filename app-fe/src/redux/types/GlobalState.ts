export enum Location {
  starting = 'starting',
  destination = 'destination',
}

export interface PredictionsStateType {
  [Location.starting]?: Array<any>;
  [Location.destination]?: Array<any>;
}

export interface LocationsStateType {
  [Location.starting]?: string;
  [Location.destination]?: string;
}

export interface DirectionsStateType {
  path?: Array<Array<string>>;
  totalDistance?: number;
  totalTime?: number;
}

export interface ResourceRetrievalStatusStateType {
  state?: string;
  status?: string;
  error?: string;
  colour?: string;
  message?: string;
}

// Keep at end of file
export interface GlobalState {
  predictions: PredictionsStateType;
  locations: LocationsStateType;
  directions: DirectionsStateType;
  resourceRetrievalStatus: ResourceRetrievalStatusStateType;
}
