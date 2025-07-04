// types
export const CHECK_LOGIN = "CHECK_LOGIN";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";

export const checkLogin = (isLoggedIn: boolean, userData: any = null) => ({
  type: CHECK_LOGIN,
  payload: { isLoggedIn, userData },
});

export const updateUserData = (userData: any) => ({
  type: UPDATE_USER_DATA,
  payload: userData,
});
