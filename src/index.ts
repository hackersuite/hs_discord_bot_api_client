import axios from 'axios';
import { createHmac } from 'crypto';

export enum AuthLevel {
	Unverified,
	Applicant,
	Attendee,
	Volunteer,
	Organiser
}

export interface APIDiscordResource {
	name: string;
	discordId: string;
}

export interface APIUser {
	authId: string;
	discordId: string;
	authLevel: AuthLevel;
	email: string;
	name: string;
	team?: string;
	roles: APIDiscordResource[];
}

export interface APITeam {
	authId: string;
	name: string;
	creator: string;
	teamNumber: number;
}

export interface RoleOptions {
	method: 'add' | 'set' | 'remove';
	roles: string[];
}

interface AccountSyncResponse {
	message: string;
}

interface AccountLinkResponse {
	message: string;
	url: string;
}

interface ModifyRolesResponse {
	user: {
		discordId: string;
		authId: string;
		roles: APIDiscordResource[];
	};
}

const API_BASE = process.env.HS_DISCORD_API;
if (!API_BASE) throw new Error('HS_DISCORD_API environment variable is unset');

export async function getUsers(): Promise<APIUser[]> {
	const response: any = await axios.get(`${API_BASE}/api/v1/users`);
	return response.data.users as APIUser[];
}

export async function getUser(discordId: string): Promise<APIUser> {
	// Will throw if user is not found
	const response: any = await axios.get(`${API_BASE}/api/v1/users/${discordId}`);
	return response.data.user as APIUser;
}

export async function modifyUserRoles(discordId: string, options: RoleOptions) {
	const response: any = await axios.put(`${API_BASE}/api/v1/users/${discordId}/roles`, options);
	return response.data as ModifyRolesResponse;
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

export async function getDiscordResource(name: string): Promise<string> {
	// Will throw if resource is not found
	const response: any = await axios.get(`${API_BASE}/api/v1/discord/resources/${name}`);
	return response.data.discordId;
}

export function createVerificationHmac(authId: string, hmacKey: string): string {
	const hash = createHmac('sha256', hmacKey)
		.update(authId)
		.digest('base64');
	return Buffer.from(`${authId}:${hash}`).toString('base64');
}

export async function linkAccount(authId: string, code: string, state: string): Promise<AccountLinkResponse> {
	const response: any = await axios.get(`${API_BASE}/api/v1/discord/verify`, {
		params: { code, state }
	});
	return response.data as AccountLinkResponse;
}

export async function syncAccount(discordId: string): Promise<AccountSyncResponse> {
	const response: any = await axios.put(`${API_BASE}/api/v1/users/${discordId}/sync`);
	return response.data as AccountSyncResponse;
}
