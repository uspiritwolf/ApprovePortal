
import { UserBaseInfo } from '@/types/UserInfo'; 

export interface Approver extends UserBaseInfo {
	status: 'Approved' | 'Rejected' | 'Pending';
}

export interface Approval {
	id: string;
	createdBy: UserBaseInfo;
	title: string;
	date: string;
	description: string;
	status: 'Approved' | 'Rejected' | 'Pending';
	approvers: Approver[];
}