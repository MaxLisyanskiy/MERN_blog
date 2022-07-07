import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello')
})

app.post('/auth/login', (req, res) => {
	const token = jwt.sign(
		{
			email: req.body.email,
			fullName: 'Max Lis',
		},
		'secret123'
	)

	res.json({
		success: true,
		token,
	})
})

app.listen(8888, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server listening on port:8888')
})
