import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { validationResult } from 'express-validator'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			success: true,
			...userData,
			token,
		})
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Не удалось зарегистрироваться',
			err,
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(403).json({
				success: false,
				message: 'Пользователь не найден',
			})
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

		if (!isValidPass) {
			return res.status(401).json({
				success: false,
				message: 'Неверный логин или пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)
		const { passwordHash, ...userData } = user._doc

		res.json({
			success: true,
			...userData,
			token,
		})
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Не удалось авторизоваться',
			err,
		})
	}
}

export const getMe = async (req, res) => {
	const user = await UserModel.findById(req.userID)

	if (!user) {
		return res.status(404).json({
			success: false,
			message: 'Пользователь не найден',
		})
	}

	const { passwordHash, ...userData } = user._doc

	try {
		res.json({
			success: true,
			...userData,
		})
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Не удалось зарегистрироваться',
		})
	}
}
