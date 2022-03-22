import express from 'express'

import { getUserProfile } from '../controllers/user/profileController.js'
import { registerUser } from '../controllers/user/regController.js'

const route = express.Router()

route.route('/profile').get(getUserProfile)
route.route('/').post(registerUser)

export default route
