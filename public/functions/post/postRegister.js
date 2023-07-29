import mm from '../../models/User.js'
import { validationResult } from 'express-validator'

export default async function postRegister(req, res) {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await new mm({
			fullName: req.body.user_name,
			email: req.body.email,
			password: req.body.password,
			age: req.body.age,
			status: 'User',
		})

		await user.save()

		res.cookie('_id', user._id, { signed: true })

		res.redirect('/me')
	} else {
		res.render('Register', { errors: errors.array() })
	}
}
