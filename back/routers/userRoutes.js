import express from 'express'

import { getUserProfile } from '../controllers/userController.js'

const route = express.Router()

route.route('/profile').get(getUserProfile)

export default route
