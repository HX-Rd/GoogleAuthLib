export interface IClientConfig{
    redirectUrl: string;
    clientId: string;
    redirectAfterLogin?: string;
    redirectAfterLogout?: string;
    scopes?: string[];
}
