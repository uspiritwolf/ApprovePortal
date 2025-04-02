import { createContext } from 'react';

export interface UserInfo
{
	username: string;
	role: string;
}

export interface AuthContextType
{
	token: string | null;
	onLogin: (token: string) => Promise<boolean>;

	userInfo: UserInfo | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
