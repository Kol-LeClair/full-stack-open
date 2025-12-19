import { render, screen } from '@testing-library/react'
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
})