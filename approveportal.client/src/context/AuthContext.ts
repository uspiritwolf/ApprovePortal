import { createContext } from 'react';
import { UserInfo } from '@/types/UserInfo';

export interface AuthContextType
{
	isBusy: boolean;
	token: string | null;
	user: UserInfo | null;

	onLogin: (token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(null!);

export type { UserInfo };