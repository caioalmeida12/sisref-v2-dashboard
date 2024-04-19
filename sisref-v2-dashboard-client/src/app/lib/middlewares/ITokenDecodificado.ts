export interface ITokenDecodificado {
    iss: string;
    iat: number;
    exp: number;
    nbf: number;
    jti: string;
    sub: string;
    prv: string;
    role: string;
    name: string;
}