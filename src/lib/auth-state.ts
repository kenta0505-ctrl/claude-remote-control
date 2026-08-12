/** Shared by the login action and the login form; a "use server" module may only export async functions. */
export type LoginState = { error: string };

export const EMPTY_LOGIN_STATE: LoginState = { error: "" };
