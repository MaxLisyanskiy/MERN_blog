import express from 'express'

import mongoose from 'mongoose'

import { registerValidation } from './validation/auth.js'

import checkAuth from './middleware/checkAuth.js'

import * as UserController from './controllers/UserController.js'

mongoose
	.connect('mongodb+srv://Max:maxmaxmax@cluster0.aetsxnu.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('MongoDB connection is successful'))
	.catch(err => console.log('MongoDB connection is error', err))

const app = express()

app.use(express.json())

app.post('/auth/login', UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(8888, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server listening on port:8888')
})
