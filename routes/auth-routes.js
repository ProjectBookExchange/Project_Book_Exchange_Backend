
const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

authRoutes.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const city = req.body.city;
	const contact = req.body.contact;

	if (!username || !password) {
		res.json({ message: 'Provide username and password' }).status(400)
		return;
	}

	if (password.length < 7) {
		res
		.json({ message: 'Please make your password at least 8 characters long for security purposes.' })
			.status(400)
			
		return;
	}

	User.findOne({ username }, (err, foundUser) => {
		if (err) {
			res
			.json({ message: 'Username check went bad.' })
			.status(500);
			return;
		}

		if (foundUser) {
			res
			.json({ message: 'Username taken. Choose another one.' })
			.status(400)
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(password, salt);

		const aNewUser = new User({
			username: username,
			password: hashPass,
			city: city,
			contact: contact
		});

		aNewUser.save((err) => {
			if (err) {
        console.log(err)
				res.status(400).json({ message: 'Saving user to database went wrong.' });
				return;
			}

			req.login(aNewUser, (err) => {
				if (err) {
					res.status(500).json({ message: 'Login after signup went bad.' });
					return;
				}

				res.status(200).json(aNewUser);
			});
		});
	});
});

authRoutes.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, theUser, failureDetails) => {
			if (err) {
					res.status(500).json({ message: 'Something went wrong authenticating user' });
					return;
			}
	
			if (!theUser) {
					res.json(failureDetails).status(401);
					return;
			}

			req.login(theUser, (err) => {
					if (err) {
							res.status(500).json({ message: 'Session save went bad.' });
							return;
					}

					res.status(200).json(theUser);
			});
	})(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
	}
  res.json({ });
});

module.exports = authRoutes;
