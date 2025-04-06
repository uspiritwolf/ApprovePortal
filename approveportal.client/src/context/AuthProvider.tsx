import { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { AuthContext, UserInfo, AuthActions, AuthDispatchContext } from '@/context/AuthContext'

interface AuthProviderProps {
	children: ReactNode;
}

type AuthProviderState = {
	type: 'LoggedIn' | 'LoggedOut' | 'Checking';
	isBusy: boolean;
	token: string | null;
	user: UserInfo | null;

	lastError?: string;
}

function authReducer(state: AuthProviderState, action: AuthActions): AuthProviderState {
	switch (action.type) {
		case 'OnLogin':
			return {
				...state,
				type: 'Checking',
				token: action.token,
				isBusy: true
			}
		case 'LoggedIn':
			localStorage.setItem('token', state.token!);
			return {
				...state,
				type: 'LoggedIn',
				user: action.user,
				isBusy: false
			}
		case 'LogOut':
			localStorage.removeItem('token');
			return {
				...state,
				type: 'LoggedOut',
				user: null,
				token: null,
				isBusy: false
			}
		default:
			return state;
	}
}

const initialAuthState: AuthProviderState = {
	type: 'Checking',
	isBusy: true,
	token: localStorage.getItem('token'),
	user: null
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, dispatch] = useReducer(authReducer, initialAuthState);

	const fetchUserInfo = useCallback(async () => {
		if (!state.token) {
			dispatch({ type: 'LogOut' })
			return
		}

		const response = await fetch('api/auth/me', {
			headers: {
				'Authorization': `Bearer ${state.token}`
			}
		})

		if (response.ok) {
			const data = await response.json()
			dispatch({
				type: 'LoggedIn',
				user: data
			})
		}
		else {
			dispatch({ type: 'LogOut' })
		}
	}, [state.token])

	useEffect(() => {
		switch (state.type) {
			case 'Checking':
				fetchUserInfo()
				break;
			default:
				break;
		}
	}, [state.type, fetchUserInfo])

	return (
		<AuthContext.Provider value={state}>
			<AuthDispatchContext.Provider value={dispatch}>
				{children}
			</AuthDispatchContext.Provider>
		</AuthContext.Provider>
	);
};