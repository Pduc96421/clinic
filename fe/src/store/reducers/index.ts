import { combineReducers } from "redux";

import loginReducer from "./login";

const allReducers = combineReducers({
  auth: loginReducer,
});

export type RootState = ReturnType<typeof allReducers>;
export default allReducers;
