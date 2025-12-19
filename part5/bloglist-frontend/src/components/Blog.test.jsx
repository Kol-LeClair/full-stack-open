import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but does not automatically show url or likes', () => {
    const blog = {
        title: 'Title',
        author: 'Author',
        url: 'Url.com'
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('Title', { exact: false })
    
    expect(element).toBeDefined()
    expect(screen.getByText('Author', { exact: false })).toBeDefined()

    expect(screen.queryByText('Url.com')).toBeNull()
    expect(screen.queryByText('likes')).toBeNull()

    // screen.debug()
    // screen.debug(element)
})

test('clicking view button shows url and likes', async () => {
    const blog = {
        title: 'Title',
        author: 'Author',
        url: 'Url.com',
        user: {
            name: 'Me'
        }
    }

    // const mockHandler = vi.fn()

    render( <Blog blog={blog} user={blog.user} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByText('Url.com')
    expect(element).toBeVisible()

    // expect(mockHandler.mock.calls).toHaveLenght(1)
})