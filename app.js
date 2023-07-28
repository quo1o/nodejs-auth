import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'

import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import mm from './public/models/User.js'

import { registerValidations } from './public/validations/register.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const PORT = process.env.PORT
const ConnectionUrl = process.env.ConnectionUrl

//Configure Site
const site = express()
site.use(express.urlencoded({ extended: true }))
site.set('views', path.join(__dirname, 'views'))
site.use(express.static(path.join(__dirname + '/public')))
site.set('view engine', 'ejs')
site.use(cookieParser(process.env.KEY))

//App GET

site.get('/', function (req, res) {
	res.render('Home')
})
site.get('/signup', function (req, res) {
	res.render('Register')
})
site.get('/login', function (req, res) {
	res.render('Login', { error: '' })
})
site.get('/register', function (req, res) {
	res.render('Register')
})
site.get('/exit', (req, res) => {
	res.clearCookie('_id').redirect('/')
})

site.get('/me', async (req, res) => {
	try {
		console.log(req.body.password)
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
})

//App POST
site.post('/me', async (req, res) => {
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
})
site.post('/login', async (req, res) => {
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
})
site.post('/register', registerValidations, async (req, res) => {
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
})

function start() {
	try {
		mongoose.connect(ConnectionUrl).then(() => {
			site.listen(PORT, err => {
				err
					? console.log(err)
					: console.log(`Server is listening on port ${PORT}`)
			})
		})
	} catch (e) {
		console.log(e)
	}
}
start()
