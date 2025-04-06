import { createContext } from 'react';
import { UserInfo } from '@/types/UserInfo';

export interface AuthContextType
{
	isBusy: boolean;
	token: string | null;
	user: UserInfo | null;
}

export type AuthActions =
	| { type: 'OnLogin', token: string }
	| { type: 'LoggedIn', user: UserInfo }
	| { type: 'LogOut' };

export const AuthContext = createContext<AuthContextType>(null!);
export const AuthDispatchContext = createContext<React.Dispatch<AuthActions>>(null!);

export type { UserInfo };