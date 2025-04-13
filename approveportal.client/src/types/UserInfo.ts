
export interface UserBaseInfo {
	id: string
	username: string
	email: string
	name: string
}

export interface UserProfileInfo extends UserBaseInfo {
	role: string;
}