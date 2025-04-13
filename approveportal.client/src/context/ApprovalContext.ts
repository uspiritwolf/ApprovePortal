import { Approval } from "@/types/Approval";
import { createContext } from "react";

export interface ApprovalContextType {
	isBusy: boolean;
	approvals: Approval[];
	refresh: () => Promise<void>;
}

export const ApprovalContext = createContext<ApprovalContextType>(null!);