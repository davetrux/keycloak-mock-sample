import { createContext, ReactElement, useEffect, useState } from 'react'
import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js"
import User from '../models/User.ts'


const keycloakConfig: KeycloakConfig = {
    realm: 'development',
    clientId: 'demo',
    url: 'http://localhost:8091'
}

const keycloakInitOptions: KeycloakInitOptions = {
    onLoad: "login-required"
}

const keycloak = new Keycloak(keycloakConfig)

export interface AuthContextValues {
    isAuthenticated: boolean,
    user: User,
    logout: () => void
}

const defaultAuthContextValues: AuthContextValues = {
    isAuthenticated: false,
    user: new User(),
    logout: () => {}
}
export const AuthContext = createContext<AuthContextValues>(defaultAuthContextValues)

interface AuthContextProviderProps {
    children: ReactElement
}

const AuthContextProvider = (props: AuthContextProviderProps) => {

    const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<User>(new User())

    useEffect(() => {
        async function initializeKeycloak() {
            try {
                const isAuthenticatedResponse = await keycloak.init(keycloakInitOptions)

                if (!isAuthenticatedResponse) {
                    // user is not yet authenticated. forward user to login
                    keycloak.login()
                }
                setAuthenticated(isAuthenticatedResponse)
            } catch (error) {
                console.error("error initializing Keycloak")
                console.error(error)
                setAuthenticated(false)
            }
        }

        initializeKeycloak()
    }, [])

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await keycloak.loadUserProfile()
                const foundUser = new User()
                if (profile.firstName) {
                    foundUser.firstName = profile.firstName
                }
                if (profile.lastName) {
                    foundUser.lastName = profile.lastName
                }
                if (profile.username) {
                    foundUser.userName = profile.username
                }
                setUser(foundUser)
            } catch (error) {
                console.error("error trying to load the user profile")
                console.error(error)
            }
        }

        if (isAuthenticated) {
            loadProfile()
        }
    }, [isAuthenticated])

    const logout = () => {
        keycloak.logout()
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, logout }}>{props.children}</AuthContext.Provider>
    )
}
export default AuthContextProvider
