/* eslint-disable react/no-unescaped-entities */
import React, {useState, useContext} from "react";
// import Navigate
import { useNavigate } from 'react-router-dom';

// Reducer import
import UseFormReducer, {getActionSetValue, getActionReset} from "../../reducers/UseFormReducer";
import { loginContext } from '../../Context/loginContext'; 

//import user methods
import {signupRequest} from '../../services/userRequests'
import { loginRequest } from '../../services/userRequests'
import {setToken} from '../../services/instance'



//Material UI imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import './signUpFormStyles.scss';


function SignUpForm(){
  //useReducer configs
  const { formState, formDispatch } = UseFormReducer();
  const reset = () => formDispatch(getActionReset());
  const navigate = useNavigate(); 


  //States
  const[connectionEmail, setConnectionEmail] = useState('admin@admin.com');
  const[connectionPassword, setConnectionPassword] = useState('');
  const { setIsLogged } = useContext(loginContext); 
  const { setPseudo } = useContext(loginContext); 
  const [loggingError, setLoggingError] = useState('');
  const [signupError, setSignupError] = useState('');
  const {setIsRoleAdmin} = useContext(loginContext);
  const[successSignup, setSuccessSignup] = useState('');



  //Form methods
  const handleTextFieldChange = (e) => {
    formDispatch(getActionSetValue(e.target.name, e.target.value));
  }

  const handleCheckBoxChange = (e) => {
    formDispatch(getActionSetValue(e.target.name, e.target.checked))
  }

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    if(formState.firstname === '') {
      setSignupError('veuillez rentrer votre prénom');
      return;
    }
    
    if(formState.lastname === '') {
      setSignupError('veuillez rentrer votre nom');
      return;
    }

    if(formState.email === '' ) {
      setSignupError('veuillez rentrer une adresse email');
      console.log('error ===>', signupError )
      return;
    }

    if (!isValidEmail(formState.email)) {
      setSignupError('Email non valide');
      return;
    }

    if(formState.password !== formState.confirmPassword){
      setSignupError('Passwords non identiques');
      return;
    }

    if(formState.generalConditions === false) {
      setSignupError('Veuillez accepter les conditions générales');
      return;
    }

    if(formState.RGPD === false) {
      setSignupError('Veuillez accepter la politique de confidentialité');
      return;
    }

   await signupRequest(formState.email, formState.firstname, formState.lastname, formState.password, formState.confirmPassword);
   setSuccessSignup('Votre compte a bien été crée, vous pouvez vous connecter');
   setSignupError('');
   reset();
  }

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmitLoginForm = async (e) => {
    e.preventDefault(); 
    try {
      const response = await loginRequest(connectionEmail, connectionPassword); 
      setToken(response.token);
      console.log(response.token);
      if (response.logged){
        setIsLogged(true);
        setPseudo(response.pseudo);
        setLoggingError('')
        if(response.role === 'admin'){
          setIsRoleAdmin(true);
          navigate('/admin'); 
        } else { 
            navigate("/")
      }
      }
      
    } catch (error) {
      console.log(error.message)
      setLoggingError('mauvais password ou email');
    }
    
}
  return(
    <div className= "container-form">
        
      <div className="connexion">
      <h1 className="title">
          Connexion
        </h1>
        <p className="text">
        Hey Salut l'ami ! Dis moi, on s'est pas déjà vu quelque part? 
      </p>
      <Box 
   sx={{
     margin: 5
    }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmitLoginForm}
      >
        <Grid container  spacing={2} >
          <Grid item xs={12} sm={6}>
            <TextField color="error"
              label="Email"
              name="connectionEmail"
              value={connectionEmail}
              onChange={(e) => setConnectionEmail( e.target.value)}
              
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField color="error"
              type="password"
              label="Password"
              name="connexionPassword"
              value={connectionPassword}
              onChange={(e) => setConnectionPassword(e.target.value)}
              
              fullWidth
            />
          </Grid>
          <Grid item>
              <Button
                color="error"
                variant="contained"
                type="submit">
                {/* {isLogged && <Navigate to='/'/>} */}
                Valider
              </Button>
            </Grid>
          </Grid>
          </Box>
      </div>
      {loggingError && (
        <div className="ui negative message">
          {loggingError}
        </div>)}

      

      <h1 className="title">
          Inscription
        </h1>
    
      <p className="text">
        Vous n'avez pas de compte ? On a pourtant comme un air de
déjà vu ... Rejoignez nous en quelques clics !
      </p>

      {signupError && (
                  <div className="ui negative big message">
                    {signupError}
                  </div>)}

      {successSignup && (
        <div className="ui green big message ">
          {successSignup}
        </div>)}
   <Box 
   sx={{
     margin: 5
    }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSignUpSubmit}
      >
        <Grid container  spacing={2} >
          <Grid item xs={12} sm={6}>
            <TextField color="error"
              label="Prénom"
              name="firstname"
              value={formState.firstname}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField color="error"
              label="Nom"
              name="lastname"
              value={formState.lastname}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>
          <Grid item xs={12} >
            <TextField color="error"
              label="Email"
              name="email"
              value={formState.email}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField color="error"
              label="Numéro de rue"
              name="addressNumber"
              value={formState.addressNumber}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField color="error"
              label="Rue"
              name="addressStreet"
              value={formState.addressStreet}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField color="error"
              label="Code postal"
              name="addressPostal"
              value={formState.addressPostal}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField color="error"
              label="Ville"
              name="addressCity"
              value={formState.addressCity}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>

          <Grid item xs={12} >
            <TextField color="error"
              type="password"
              label="Password"
              name="password"
              value={formState.password}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>

          <Grid item xs={12} >
            <TextField color="error"
              type="password"
              label="Confirmer password"
              name="confirmPassword"
              value={formState.confirmPassword}
              onChange={handleTextFieldChange}
              
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <FormControlLabel
              label="M'inscrire à la newsletter (facultatif)"
              control={(
                <Checkbox
                  color="error"
                  value={formState.newsletter}
                  checked={formState.newsletter}
                  name="newsletter"
                  onChange={handleCheckBoxChange}

                />
              )}
            />
            <FormControlLabel
              label="J'accepte les conditions générales"
              control={(
                <Checkbox
                  color="error"
                  name="generalConditions"
                  checked={formState.generalConditions}
                  value={formState.generalConditions}
                  onChange={handleCheckBoxChange}

                />
              )}
            />
             <FormControlLabel
              label="J'accepte la politique de confidentialité relative au
              traitement de mes données personnelles"
              control={(
                <Checkbox
                  color="error"
                  name="RGPD"
                  value= {formState.RGPD}
                  checked={formState.RGPD}
                  onChange={(handleCheckBoxChange)}
                />
              )}
            />
          </Grid>          

          <Grid item xs={12} spacing={2} container justifyContent="flex-end">
            <Grid item>
              <Button
                color="error"
                variant="outlined"
                type="button"
                onClick={reset}
              >
                RESET
              </Button>

            </Grid>
            <Grid item>
              <Button
                color="error"
                variant="contained"
                type="submit"
              >
                Enregistrer
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    
  </div>
  );
}

export default React.memo(SignUpForm);