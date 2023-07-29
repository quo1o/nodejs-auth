import mm from '../../models/User.js'
export default async function postLogin(req, res){
	const name = req.body.user_name
	const password = req.body.password

	try {
		const user = await mm.find({
			fullName: name,
			password: password,
		})
		console.log(user[0])
		if (user.length === 0) {
			res.render('Login', { error: 'No such user or incorrect password' })
		}
		const obj = user[0]
		res.cookie('_id', obj._id, { signed: true })
		res.redirect('/me')
	} catch (error) {
		console.log(error)
	}
}