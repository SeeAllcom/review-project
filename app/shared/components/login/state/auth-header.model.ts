export enum AuthTabsTypeEnum {
  Login = 'Log in',
  SignUp = 'Sign up',
  PasswordRecovery = 'Password Recovery',
}

export interface AuthTypes {
  activeAuthTab: AuthTabsTypeEnum;
}
