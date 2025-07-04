import { CHECK_LOGIN, UPDATE_USER_DATA } from "../actions/login";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string;
  avatar: string;
  [key: string]: any;
}

interface AuthState {
  isLoggedIn: boolean;
  userData: UserData | null;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
};

const loginReducer = (state = initialState, action: Action): AuthState => {
  switch (action.type) {
    case CHECK_LOGIN:
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        userData: action.payload.userData ?? state.userData,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

export default loginReducer;
