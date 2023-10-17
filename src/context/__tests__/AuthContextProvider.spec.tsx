import { describe, it, vi, expect, beforeEach } from 'vitest'
import Keycloak, { KeycloakProfile } from 'keycloak-js'
import { useContext } from 'react'
import AuthContextProvider, { AuthContext } from '../AuthContextProvider.tsx'
import { render, screen } from '@testing-library/react'

describe('AuthContextProvider', () => {

    vi.mock('keycloak-js', () => {
        const fakeUser = { firstName: 'Test', lastName: 'User', username: 'tuser'} as KeycloakProfile
        const fakeKeycloak = {
            init: (): boolean => { return true },
            loadUserProfile: (): KeycloakProfile => { return fakeUser },
            login: vi.fn(),
            logout: vi.fn()
        }
        return { default: vi.fn(() => fakeKeycloak) }
    })

    beforeEach(() => {

    })

    const TestComponent = () => {
        const context = useContext(AuthContext)
        function logout() {
            context.logout()
        }

        return (
            <div>
                <div>{context.isAuthenticated}</div>
                <div>{context.user.firstName}</div>
                <div>{context.user.lastName}</div>
                <div>{context.user.userName}</div>
                <button onClick={logout}>Logout</button>
            </div>
        )
    }

    it('Loads properly', async () => {
        render(<AuthContextProvider><TestComponent /></AuthContextProvider>)
        const firstName = await screen.findByText('Test')
        expect(firstName).toBeInTheDocument()
        const userName = await screen.findByText('tuser')
        expect(userName).toBeInTheDocument()
    })

    it('Redirects to Login', () => {
        const mockedKeycloak = vi.mocked(Keycloak).mock.results[0].value
        mockedKeycloak.init = vi.fn(() => { return false })
        render(<AuthContextProvider><TestComponent /></AuthContextProvider>)
        const result = screen.queryAllByText('tuser')
        expect(result).toHaveLength(0)
    })

    it('Logs out properly', async () => {
        render(<AuthContextProvider><TestComponent /></AuthContextProvider>)
        const logout = await screen.findByRole('button') as HTMLButtonElement
        logout.click()
        expect(vi.mocked(Keycloak).mock.results[0].value.logout).toHaveBeenCalled()
    })

    it('Has an Init Error', () => {
        const mockedKeycloak = vi.mocked(Keycloak).mock.results[0].value
        mockedKeycloak.init = vi.fn(() => { throw new Error("test error") })
        render(<AuthContextProvider><TestComponent /></AuthContextProvider>)
        const result = screen.queryAllByText('tuser')
        expect(result).toHaveLength(0)
    })
})