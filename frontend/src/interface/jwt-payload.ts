export type AuthToken = {
    token_type: "auth_token" | "refresh_token";
    sub: string;
    username: string;
    exp: number;
}
