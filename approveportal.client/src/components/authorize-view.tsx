import { ReactNode, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface AuthorizeViewProps {
	children: ReactNode;
	redirectPath?: string;
}

export function AuthorizeView({ children, redirectPath = "/login" }: AuthorizeViewProps) {
	const { userInfo, isBusy } = useContext(AuthContext);
	const isAuthorized = !!userInfo;

	if (isBusy) {
		return <div>Authorization...</div>;
	}

	return isAuthorized ? children : <Navigate to={redirectPath} replace />
}
