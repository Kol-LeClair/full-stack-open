const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(
        (total, blog) => total + blog.likes,
        0
    )
}

const favoriteBlog = (blogs) => {
     return blogs.reduce(
        (previous, current) => (previous.likes > current.likes) ? previous : current
    )
}

const mostBlogs = (blogs) => {
    return {
        author: _.head(_(blogs)
            .countBy('author')
            .entries()
            .maxBy(_.last)    
        ),

        blogs: _.size(_.filter(blogs, {
            'author': _.head(_(blogs)
                .countBy('author')
                .entries()
                .maxBy(_.last)    
            )
        }))
    }
}

const mostLikes = (blogs) => {
    let authors = []

    blogs.forEach(blog => {
        if (!Array.prototype.includes.call(authors.map(author => author.author), blog.author)) {
            authors.push({
                author: blog.author,
                likes: blog.likes
            })        
        } else {
            authors.find(author => author.author === blog.author).likes = authors.find(author => author.author === blog.author).likes + blog.likes
        }
    })
    
    return authors.reduce(
        (previous, current) => (previous.likes > current.likes) ? previous : current
    )
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}