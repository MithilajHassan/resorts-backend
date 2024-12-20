import jwt from "jsonwebtoken"

export interface JwtPayload {
    id: string;
    role?: string
}

export function verifyRefreshToken(token:string) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
}

export function verifyAccessToken(token:string) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
}

export function generateAccessToken(payload:JwtPayload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
}

export function generateRefreshToken(id:string) {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
}