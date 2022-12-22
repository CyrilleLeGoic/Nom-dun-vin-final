const { User } = require('../models');
const emailValidator = require('email-validator'); 
const jsonwebtoken = require('jsonwebtoken'); 
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt'); 
const { escape } = require('sanitizer');

const userController = {

	/** @function 
   * Create new user in database if user doesn't exist 
   * @param {String} email- user's email
   * @param {String} password - user's password
   * @param {String} confirmPassword - user's confirmPassword
   * @param {String} firstname - user's firstname
   * @param {String} lastname- user's lastname
   * @param {String} [address_number] - user adress's number
   * @param {String} [address_street] - user adress's street
   * @param {String} [address_postal] - user adress's postal
   * @param {String} [address_city] - user adress's city
   */
	async signupAction(req, res){
		try {
			const {email, password, confirmPassword, firstname, lastname, address_number, address_street, address_postal, address_city} = req.body; 

			//1. Check the user doesn't exist in the DB.
			const searchedUser = await User.findOne({
				where : {
					email : escape(email)
				}
			});

			if(searchedUser){
				throw new Error('Signup does not work, invalid email or password'); 
			}
            
			//2. Check that the email format is valid with email-validator
			if(!emailValidator.validate(escape(email))){
				throw new Error('Signup does not work, invalid email or password');
			}

			//3. Check that the password and confirmation are identical
			if(escape(password) !== escape(confirmPassword)){
				throw new Error('Signup does not work, invalid email or password');
			}

			//4. Encrypting the password with bcrypt
			const hashedPassword = bcrypt.hashSync(escape(password), 10); 

			//5. Check that firstname and lastname exist
			if(!firstname || firstname.trim() === ''){
				throw new Error('"firstname" property is missing');
			}

			if(!lastname || lastname.trim() === ''){
				throw new Error('lastname" property is missing');
			}

			//6. Create an instance, save it in the database
			const newUser = User.build({
				email : escape(email),
				password : hashedPassword,
				firstname : escape(firstname.trim()), 
				lastname : escape(lastname.trim())
			}); 

			if(Number(address_number)){
				newUser.address_number = Number(escape(address_number));
			}

			if(address_street && address_street.trim() !== ''){
				newUser.address_street = escape(address_street.trim());
			}

			if(address_postal && address_postal.trim() !== ''){
				newUser.address_postal = escape(address_postal.trim());
			}

			if(address_city && address_city.trim() !== ''){
				newUser.address_city = escape(address_city.trim());
			}

			await newUser.save(); 
			res.status(200).json(newUser);  

		} catch (error) {
			console.log(error); 
			res.status(500).json({ message: error.message }); 
		}
	}, 

	/** @function 
   * Connect user and create session
   * @param {String} email- user's email
   * @param {String} password - user's password
   */
	async loginAction(req, res){
		try {

			//1. Check the user exist in the DB.
			const searchedUser = await User.findOne({
				where : {
					email : escape(req.body.email)
				}
			});
			if(!searchedUser){
				throw new Error('Login does not work, invalid email or password');
			}
			//2. Check the password is valid (vs bdd) with compareSync of bcrypt
			const validPassword = bcrypt.compareSync(req.body.password, searchedUser.password); 
			if(!validPassword){
				throw new Error('Login does not work, invalid email or password');
			}

			//3. Token JWT
			if(searchedUser){
				const jwtContent = { userId: searchedUser.id, role: searchedUser.role };
				const jwtOptions = { 
					algorithm: 'HS256', 
					expiresIn: '3h' 
				};
				let token = jsonwebtoken.sign(jwtContent, jwtSecret, jwtOptions);
				
				return res.status(200).json({ 
					token: token,
					logged: true,
					pseudo : searchedUser.firstname, 
					role : searchedUser.role,
				}); 
			}
		} catch (error) {
			console.log(error); 
			res.status(401).json({ message: error.message });   
		}
	}, 

	/** @function 
   * Verify Token
   * @returns {Object} objet containing logged, pseudo and role property
   */
	async verifyToken(req,res){
		try {
			const token = req.headers.authorization.split(' ')[1];
			req.token = jsonwebtoken.verify(token, jwtSecret);


			if(!token){
				throw new Error('Token doesn\'t exist');
			}

			let user = await User.findByPk(req.token.userId);
			if(!user){
				throw new Error(`user with id ${req.token.userId} doesn't exist`);
			}
 

			return res.status(200).json({ 
				logged: true,
				pseudo : user.firstname, 
				role : user.role,
			}); 
			
		} catch (error) {


			res.status(401).json({ message : 'Invalid authentification token'});
		}
	}
};

module.exports = userController;