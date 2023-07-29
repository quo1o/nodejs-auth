import mm from '../../models/User.js'
export default async function getMe(req, res) {
	try {
		console.log(req.signedCookies._id)
		if (!req.signedCookies._id) {
			res.cookie('msg', 'Login first', { signed: true })
			res.redirect('/login')
		} else {
			const user = await mm
				.find({
					_id: req.signedCookies._id,
				})
				.select()
				.exec()
				.then(obj => {
					return obj
				})

			const obj = user[0]
			res.render('Success', {
				user: obj,
				isAccess: true,
			})
		}
	} catch (e) {
		console.log(e)
	}
}
