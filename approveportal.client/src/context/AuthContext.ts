import { createContext } from 'react';
import { UserProfileInfo } from '@/types/UserInfo';

export interface AuthContextType
{
	isBusy: boolean;
	token: string | null;
	user: UserProfileInfo | null;

	onLogin: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(null!);

export type { UserProfileInfo };