import axios from 'axios';

enum AuthLevel {
	Unverified,
	Applicant,
	Attendee,
	Volunteer,
	Organiser
}

export interface APIUser {
	authId: string;
	discordId: string;
	authLevel: AuthLevel;
	email: string;
	name: string;
	team?: string;
}

export interface APITeam {
	authId: string;
	name: string;
	creator: string;
	teamNumber: number;
}

const API_BASE: string = process.env.HS_DISCORD_API || '';

export async function getUsers(): Promise<APIUser[]> {
	const response: any = await axios.get(`${API_BASE}/api/v1/users`);
	return response.data.users as APIUser[];
}

export async function getUser(discordId: string): Promise<APIUser> {
	// Will throw if user is not found
	const response: any = await axios.get(`${API_BASE}/api/v1/users/${discordId}`);
	return response.data.user as APIUser;
}

export async function getTeams(): Promise<APITeam[]> {
	const response: any = await axios.get(`${API_BASE}/api/v1/teams`);
	return response.data.teams as APITeam[];
}

export async function getTeam(authId: string): Promise<APITeam> {
	// Will throw if team is not found
	const response: any = await axios.get(`${API_BASE}/api/v1/teams/${authId}`);
	return response.data.team as APITeam;
}
