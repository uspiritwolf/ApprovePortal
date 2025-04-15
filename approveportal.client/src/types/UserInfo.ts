
export interface UserBaseInfo {
	id: string
	username: string
	email: string
	name: string
}

export type RoleType = 'Manager' | 'User';

export interface UserProfileInfo extends UserBaseInfo {
	role: RoleType;
}