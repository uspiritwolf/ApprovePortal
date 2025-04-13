
export type Approval = {
	id: string;
	createdById: string;
	name: string;
	email: string;
	subject: string;
	date: string;
	description: string;
	status: 'Approved' | 'Rejected' | 'Pending' | 'Draft';
}