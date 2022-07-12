import express from 'express'

import mongoose from 'mongoose'

import { registerValidation, loginValidation, postCreateValidation } from './utils/validations.js'

import checkAuth from './middleware/checkAuth.js'

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose
	.connect('mongodb+srv://Max:maxmaxmax@cluster0.aetsxnu.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('MongoDB connection is successful'))
	.catch(err => console.log('MongoDB connection is error', err))

const app = express()

app.use(express.json())

// User
app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

// Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(8888, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server listening on port:8888')
})
