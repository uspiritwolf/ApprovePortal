
import { UserBaseInfo } from '@/types/UserInfo'

export interface TemplateApproval {
	id: string
	title : string
	description: string
	createdById: string
	approvers: UserBaseInfo[]
}