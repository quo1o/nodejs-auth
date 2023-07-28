import { check } from 'express-validator'

//REGEX
const NameFilter = /^[a-zA-Z!.,#$%&'*+/=? ^_`{|}~-]+$/
const PasswordFilter = /^[a-zA-Z0-9! @#$%^&*]{6,16}$/
const AgeFilter = /^[0-9! a-zA-Z@#$%^&*]{1,3}$/

//Validations
const validatePass = val => {
	console.log(val)
	if (PasswordFilter.test(val)) {
		return true
	} else {
		throw new Error('Your password is wrong')
	}
}

const validateName = val => {
	console.log(val)
	if (NameFilter.test(val)) {
		return true
	} else {
		throw new Error('Your name is not valid')
	}
}
const validateAge = val => {
	console.log(val)
	if (AgeFilter.test(val)) {
		return true
	} else {
		
		throw new Error('This is not your age')
	}
}

export const registerValidations = [
	check('user_name', '').custom(validateName).isLength({ min: 3 }),
	check('password', '').custom(validatePass),
	check('rep_password', '').custom((value, { req }) => {
		if (value != req.body.password) {
			throw new Error('Password is not match')
		}
		return true
	}),
	check('email', 'Email is not true').isEmail(),
	check('age', '').custom(validateAge),
]
