export type UserResource = {
    id?: string
    email: string
    password?: string
    username: string
    points?: number
    // picture?: string
    premium?: boolean
    level?: number
    gameSound?: boolean
    music?: boolean 
    higherLvlChallenge?: boolean
}

export type Guest = {
    id?: string
    username: string
    points: number
    // picture: string
}

export type LoginResource = {
    id: string
    /** Expiration time in seconds since 1.1.1970 */
    exp: number
}