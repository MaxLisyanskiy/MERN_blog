import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()

		res.json({
			success: true,
			posts,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Не удалось найти статьи',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					return res.status(500).json({
						success: false,
						message: 'Не удалось найти статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						success: false,
						message: 'Не удалось найти статью',
					})
				}

				res.json({
					success: true,
					doc,
				})
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: 'Не удалось найти статьи',
		})
	}
}

export const remove = (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					return res.status(500).json({
						success: false,
						message: 'Не удалось удалить статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						success: false,
						message: 'Статья не найдена',
					})
				}

				res.json({
					success: true,
					message: 'Статья успешно удалена',
				})
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: 'Не удалось найти статьи',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			user: req.userID,
			imageUrl: req.body.imageUrl,
		})

		const post = await doc.save()

		res.json({
			success: true,
			post,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Не удалось создать статью',
		})
	}
}

export const update = (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				user: req.userID,
				imageUrl: req.body.imageUrl,
			},
			(err, doc) => {
				if (err) {
					return res.status(500).json({
						success: false,
						message: 'Не удалось обновить статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						success: false,
						message: 'Статья не найдена',
					})
				}

				res.json({
					success: true,
					message: 'Статья успешно обновлена',
				})
			}
		)
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Не удалось обновить статью',
		})
	}
}
