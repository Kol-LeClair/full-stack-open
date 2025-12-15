const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    
    /*
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
    */
    
    /*
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    */
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'New Blog',
        author: 'Me',
        url: "NewBlog.com",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(blog => blog.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    assert(titles.includes('New Blog'))
})

test('likes will default to 0 if not provided', async () => {
    const newBlog = {
        title: 'New Blog 2',
        author: 'Me 2',
        url: "NewBlog2.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.find(blog => blog.title === 'New Blog 2').likes, 0)
})

test('id property exists', async () => {
    const newBlog = {
        title: 'New Blog 4',
        author: 'Me 4',
        url: "NewBlog4.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')

    assert(Object.hasOwn(response.body.find(blog => blog.title === 'New Blog 4'), 'id'))
})

test('blog without title or url is not added', async () => {
    const newBlog = {
        author: 'Me 3',
        url: 'NewBlog3.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})