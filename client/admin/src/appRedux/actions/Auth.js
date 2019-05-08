import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_FACEBOOK_USER,
  SIGNIN_FACEBOOK_USER_SUCCESS,
  SIGNIN_GITHUB_USER,
  SIGNIN_GITHUB_USER_SUCCESS,
  SIGNIN_GOOGLE_USER,
  SIGNIN_GOOGLE_USER_SUCCESS,
  SIGNIN_TWITTER_USER,
  SIGNIN_TWITTER_USER_SUCCESS,
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SET_USER_ROLE,
} from 'constants/ActionTypes';

export const userSignUp = user => ({
  type: SIGNUP_USER,
  payload: user,
});
export const userSignIn = user => ({
  type: SIGNIN_USER,
  payload: user,
});
export const userSignOut = () => ({
  type: SIGNOUT_USER,
});
export const userSignUpSuccess = authUser => ({
  type: SIGNUP_USER_SUCCESS,
  payload: authUser,
});
export const setInitUrl = url => ({
  type: INIT_URL,
  payload: url,
});
export const userSignInSuccess = authUser => ({
  type: SIGNIN_USER_SUCCESS,
  payload: authUser,
});
export const setUserRole = userRole => ({
  type: SET_USER_ROLE,
  payload: userRole,
});
export const userSignOutSuccess = () => ({
  type: SIGNOUT_USER_SUCCESS,
});

export const showAuthMessage = message => ({
  type: SHOW_MESSAGE,
  payload: message,
});


export const userGoogleSignIn = () => ({
  type: SIGNIN_GOOGLE_USER,
});
export const userGoogleSignInSuccess = authUser => ({
  type: SIGNIN_GOOGLE_USER_SUCCESS,
  payload: authUser,
});
export const userFacebookSignIn = () => ({
  type: SIGNIN_FACEBOOK_USER,
});
export const userFacebookSignInSuccess = authUser => ({
  type: SIGNIN_FACEBOOK_USER_SUCCESS,
  payload: authUser,
});
export const userTwitterSignIn = () => ({
  type: SIGNIN_TWITTER_USER,
});
export const userTwitterSignInSuccess = authUser => ({
  type: SIGNIN_TWITTER_USER_SUCCESS,
  payload: authUser,
});
export const userGithubSignIn = () => ({
  type: SIGNIN_GITHUB_USER,
});
export const userGithubSignInSuccess = authUser => ({
  type: SIGNIN_GITHUB_USER_SUCCESS,
  payload: authUser,
});
export const showAuthLoader = () => ({
  type: ON_SHOW_LOADER,
});

export const hideMessage = () => ({
  type: HIDE_MESSAGE,
});
export const hideAuthLoader = () => ({
  type: ON_HIDE_LOADER,
});
