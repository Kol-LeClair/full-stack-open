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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}