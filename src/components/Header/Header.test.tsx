import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Header />)

    const heading = screen.getByRole('heading', {
      name: /next\.js \+ chakra ui/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
