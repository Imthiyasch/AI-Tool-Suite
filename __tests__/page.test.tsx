import { render, screen } from '@testing-library/react'
import Page from '../app/page'

// Mock the useRouter hook and createClient
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

jest.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        auth: {
            signInWithOAuth: jest.fn(),
        },
    }),
}))

describe('Home Page', () => {
    it('renders a heading', () => {
        render(<Page />)

        const heading = screen.getByRole('heading', { level: 1 })

        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent(/BREVIO\s*LUMIO/i)
    })
})
