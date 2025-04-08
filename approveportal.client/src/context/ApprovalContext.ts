import { Approval } from "@/types/Approval";
import { createContext } from "react";

export interface ApprovalContextType {
	isBusy: boolean;
	approvals: Approval[];
}

export const ApprovalContext = createContext<ApprovalContextType>(null!);