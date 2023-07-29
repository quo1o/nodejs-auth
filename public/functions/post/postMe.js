import mm from '../../models/User.js'
import { validationResult } from 'express-validator'
export default async function postMe(req, res) {
	const errors = validationResult(req)
	const user = await mm
		.findOne({
			_id: req.signedCookies._id,
		})
		.select()
		.exec()
		.then(obj => {
			return obj
		})

	if (errors.isEmpty()) {
		async function changePass() {
			await mm
				.findOneAndUpdate(
					{
						password: req.body.old_pass,
					},
					{
						password: req.body.new_pass,
					}
				)
				.select()
				.exec()
		}

		const user = await changePass()
		res.render('Success', { user: user })
	} else {
		console.log(errors)
		res.render('Success', { errors: errors.array(), user: user })
	}
}
