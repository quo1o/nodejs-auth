import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import getMe from './public/functions/get/getMe.js'
import postLogin from './public/functions/post/postLogin.js'
import postMe from './public/functions/post/postMe.js'
import postRegister from './public/functions/post/postRegister.js'
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

site.get('/', (req, res) => {
	res.render('Home')
})
site.get('/signup', (req, res) => {
	res.render('Register')
})
site.get('/login', (req, res) => {
	res.render('Login', { error: '' })
})
site.get('/register', (req, res) => {
	res.render('Register')
})
site.get('/exit', (req, res) => {
	res.clearCookie('_id').redirect('/')
})

site.get('/me', getMe)

//App POST
site.post('/me', postMe)
site.post('/login', postLogin)
site.post('/register', registerValidations, postRegister)

//Start App
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
