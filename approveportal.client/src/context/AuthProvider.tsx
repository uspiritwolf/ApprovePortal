import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, UserInfo } from '@/context/AuthContext'

interface AuthProviderProps
{
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps)
{
	const [isBusy, setIsBusy] = useState(true);

	const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

	async function onLogin(token: string)
	{
		setIsBusy(true);

		const response = await fetch('api/auth/me', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})

		if (response.ok)
		{
			const data = await response.json()
			setUserInfo(data)
			setToken(token);
			setIsBusy(false);
			return true
		}
		else
		{
			setToken(null);
			setIsBusy(false);
			return false
		}
	}

	// Should only run once
	useEffect(() => {
		if (token != null) {
			onLogin(token); // Start check token
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token);
		}
		else {
			localStorage.removeItem('token');
		}
	}, [token]);

	return (
		<AuthContext.Provider value={{ token, onLogin, userInfo, isBusy }}>
			{children}
		</AuthContext.Provider>
	);
};