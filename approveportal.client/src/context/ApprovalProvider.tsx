import { ReactNode, useReducer, useEffect, useContext, useCallback } from 'react';
import { ApprovalContext } from '@/context/ApprovalContext';
import { Approval } from '@/types/Approval';
import { AuthContext } from '@/context/AuthContext';

interface ApprovalProviderProps {
	children: ReactNode;
}

type ApprovalProviderState = {
	isBusy: boolean;
	approvals: Approval[];
}

export type ApprovalActions =
	| { type: 'REFRESH_START' }
	| { type: 'REFRESH_SUCCESS', approvals: Approval[] }
	| { type: 'REFRESH_ERROR' }

function approvalReducer(state: ApprovalProviderState, action: ApprovalActions): ApprovalProviderState {
	switch (action.type) {
		case 'REFRESH_START':
			return {
				...state,
				isBusy: true
			}
		case 'REFRESH_SUCCESS':
			return {
				...state,
				isBusy: false,
				approvals: action.approvals
			}
		case 'REFRESH_ERROR':
			return {
				...state,
				isBusy: false,
				approvals: [],
			}
		default:
			return state;
	}
}

const initialApprovalState: ApprovalProviderState = {
	isBusy: true,
	approvals: []
}

export function ApprovalProvider({ children }: ApprovalProviderProps) {
	const { token, isBusy: isAuthBusy } = useContext(AuthContext);

	const [state, dispatch] = useReducer(approvalReducer, initialApprovalState);

	const refresh = useCallback(async () => {
		if (!token) {
			dispatch({ type: 'REFRESH_ERROR' });
			return;
		}

		dispatch({ type: 'REFRESH_START' });
		const response = await fetch('/api/approval/list', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (response.ok) {
			const data = await response.json() as Approval[];
			dispatch({ type: 'REFRESH_SUCCESS', approvals: data });
		}
	}, [token])

	useEffect(() => {
		if (!isAuthBusy) {
			refresh();
		}
	}, [refresh, isAuthBusy]);

	return (
		<ApprovalContext.Provider value={{ ...state, refresh }}>
			{children}
		</ApprovalContext.Provider>
	);
}