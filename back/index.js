import express from 'express'
import multer from 'multer'

import mongoose from 'mongoose'

import { registerValidation, loginValidation, postCreateValidation } from './utils/validations.js'

import handleValidationErrors from './utils/handleValidationErrors.js'

import checkAuth from './middleware/checkAuth.js'

import { UserController, PostController } from './controllers/index.js'

mongoose
	.connect('mongodb+srv://Max:maxmaxmax@cluster0.aetsxnu.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('MongoDB connection is successful'))
	.catch(err => console.log('MongoDB connection is error', err))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())

app.use('/uploads', express.static('uploads'))

// User
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

// Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(8888, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server listening on port:8888')
})
