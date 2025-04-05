import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, UserInfo } from '@/context/AuthContext'

interface AuthProviderProps
{
	children: ReactNode;
}

interface AuthProviderState
{
	isBusy: boolean;
	token: string | null;
	userInfo: UserInfo | null;
}

export function AuthProvider({ children }: AuthProviderProps)
{
	// Better use useReducer, but not now...
	const [state, setState] = useState<AuthProviderState>({
		isBusy: true,
		token: localStorage.getItem('token'),
		userInfo: null
	});

	async function onLogin(token: string)
	{
		setState(prev => ({
			...prev,
			isBusy: true
		}))

		const response = await fetch('api/auth/me', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})

		if (response.ok)
		{
			const data = await response.json()
			setState(prev =>({
				...prev,
				isBusy: false,
				token: token,
				userInfo: data
			}))
			return true
		}
		else
		{
			setState(prev => ({
				...prev,
				isBusy: false,
				token: null,
				userInfo: null
			}))
			return false
		}
	}

	// Should only run once
	useEffect(() => {
		if (state.token != null) {
			onLogin(state.token); // Start check token
		} else {
			setState(prev => ({
				...prev,
				isBusy: false
			}))
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (state.token) {
			localStorage.setItem('token', state.token);
		}
		else {
			localStorage.removeItem('token');
		}
	}, [state.token]);

	return (
		<AuthContext.Provider value={{ onLogin, ...state }}>
			{children}
		</AuthContext.Provider>
	);
};