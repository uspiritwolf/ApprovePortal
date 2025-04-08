
export type Approval = {
	name: string;
	email: string;
	subject: string;
	date: string;
	description: string;
	status: 'Approved' | 'Rejected' | 'Pending' | 'Draft';
}