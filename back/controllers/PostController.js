import PostModel from '../models/Post.js'

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			author: req.userID,
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
