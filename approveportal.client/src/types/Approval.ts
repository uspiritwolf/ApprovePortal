
import { UserBaseInfo } from '@/types/UserInfo'; 

export type ApproveStatus = 'Approved' | 'Rejected' | 'Pending';
export interface Approver extends UserBaseInfo {
	status: ApproveStatus;
}
export interface Approval {
	id: string;
	createdBy: UserBaseInfo;
	title: string;
	date: string;
	description: string;
	status: ApproveStatus;
	approvers: Approver[];
}