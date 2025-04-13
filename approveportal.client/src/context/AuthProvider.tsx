import { ReactNode, useCallback, useReducer, useEffect } from 'react';
import { AuthContext, UserProfileInfo } from '@/context/AuthContext'

interface AuthProviderProps {
	children: ReactNode;
}

type AuthProviderState = {
	isBusy: boolean;
	token: string | null;
	user: UserProfileInfo | null;
}

export type AuthActions =
	| { type: 'REFRESH_START', token: string }
	| { type: 'REFRESH_SUCCESS', user: UserProfileInfo }
	| { type: 'LOG_OUT' };

function authReducer(state: AuthProviderState, action: AuthActions): AuthProviderState {
	switch (action.type) {
		case 'REFRESH_START':
			return {
				...state,
				token: action.token,
				isBusy: true
			}
		case 'REFRESH_SUCCESS':
			localStorage.setItem('token', state.token!);
			return {
				...state,
				user: action.user,
				isBusy: false
			}
		case 'LOG_OUT':
			localStorage.removeItem('token');
			return {
				...state,
				user: null,
				token: null,
				isBusy: false
			}
		default:
			return state;
	}
}

const initialAuthState: AuthProviderState = {
	isBusy: true,
	token: null,
	user: null
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, dispatch] = useReducer(authReducer, initialAuthState);

	const onLogin = useCallback(async (token: string | null) => {
		if (!token) {
			dispatch({ type: 'LOG_OUT' })
			return
		} else {
			dispatch({ type: 'REFRESH_START', token })
		}

		const response = await fetch('/api/auth/me', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})

		if (response.ok) {
			const data = await response.json() as UserProfileInfo
			dispatch({
				type: 'REFRESH_SUCCESS',
				user: data
			})
		}
		else {
			dispatch({ type: 'LOG_OUT' })
			throw new Error(response.statusText);
		}
	}, [dispatch])

	const logout = useCallback(async () => {
		dispatch({ type: 'LOG_OUT' })
	}, [dispatch]);

	// Automatically call onLogin with the token from localStorage on mount
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			onLogin(token).catch((e: Error) => {
				console.warn('Failed to login: ' + e.message);
			});
		} else {
			dispatch({ type: 'LOG_OUT' })
		}
	}, [onLogin]);

	return (
		<AuthContext.Provider value={{ ...state, onLogin, logout }}>
			{children}
		</AuthContext.Provider>
	);
};