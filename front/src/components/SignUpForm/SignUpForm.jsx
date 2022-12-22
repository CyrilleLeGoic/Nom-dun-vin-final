/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext, useRef } from "react";
//import react-router-dom
import { useNavigate } from 'react-router-dom';
//import token
import { setToken } from '../../services/instance'
//import reducer
import UseFormReducer, { getActionSetValue, getActionReset } from "../../reducers/UseFormReducer";
//import context
import { loginContext } from '../../Context/loginContext';
//import user request
import { signupRequest, loginRequest } from '../../services/userRequests'
//Material UI imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
//import css
import './signUpFormStyles.scss';
function SignUpForm() {
  //useReducer configs
  const { formState, formDispatch } = UseFormReducer();
  const reset = () => formDispatch(getActionReset());
  const navigate = useNavigate();
  //States
  const [connectionEmail, setConnectionEmail] = useState('');
  const [connectionPassword, setConnectionPassword] = useState('');
  const { setIsLogged } = useContext(loginContext);
  const { setPseudo } = useContext(loginContext);
  const [loggingError, setLoggingError] = useState('');
  const [signupError, setSignupError] = useState('');
  const { setIsRoleAdmin } = useContext(loginContext);
  const [successSignup, setSuccessSignup] = useState('');
  const title = useRef(null);
  const handleScroll = (ref) => {
    title.current.scrollIntoView()
  };
  //Form methods
  const handleTextFieldChange = (e) => {
    formDispatch(getActionSetValue(e.target.name, e.target.value));
  }
  const handleCheckBoxChange = (e) => {
    formDispatch(getActionSetValue(e.target.name, e.target.checked))
  }
  //handle signup with error or success message
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (formState.firstname.trim() === '') {
      setSignupError('Veuillez rentrer votre prénom');
      setSuccessSignup('');
      handleScroll(title);
      return;
    }
    if (formState.lastname.trim() === '') {
      setSignupError('Veuillez rentrer votre nom');
      setSuccessSignup('');
      handleScroll(title);
      return;
    }
    if (formState.email === '') {
      setSignupError('Veuillez rentrer une adresse email');
      setSuccessSignup('');
      handleScroll(title);
      return;
    }
    if (!isValidEmail(formState.email)) {
      setSignupError('Email non valide');
      setSuccessSignup('');
      handleScroll(title);
      return;
    }
    if (formState.password !== formState.confirmPassword) {
      setSignupError('Mots de passe non identiques');
      setSuccessSignup('');
      handleScroll(title);
      return;
    }
    if (formState.generalConditions === false) {
      setSignupError('Veuillez accepter les conditions générales');
      setSuccessSignup('');
      handleScroll(title);
      return;
    }
    if (formState.RGPD === false) {
      setSignupError('Veuillez accepter la politique de confidentialité');
      setSuccessSignup('');
      return;
    }
    try {
      await signupRequest(formState.email, formState.firstname, formState.lastname, formState.password, formState.confirmPassword);
      setSuccessSignup('Votre compte a bien été crée, vous pouvez vous connecter');
      setSignupError('');
      reset();
      handleScroll(title);
    } catch (error) {
      if(error.response.data.message){
        setSignupError('Email non disponible')
      }
      
    }
  }
  //lol
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }
  //handle login with error message and success set pseudo, connected state + jwt token
  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();
    try {
      const response = await loginRequest(connectionEmail, connectionPassword);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      if (response.logged) {
        setIsLogged(true);
        setPseudo(response.pseudo);
        setLoggingError('')
        if (response.role === 'admin') {
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
  return (
    <div className="container-form">
      <div className="connexion">
        <h1 className="title">
          Connexion
        </h1>
        <p className="text">
          Hey salut l'ami ! Dis-moi, on s'est pas déjà vu quelque part?
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
          <Grid container spacing={2} >
            <Grid item xs={12} sm={6}>
              <TextField color="error"
                label="Email"
                name="connectionEmail"
                value={connectionEmail}
                onChange={(e) => setConnectionEmail(e.target.value)}
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
                Valider
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
      {loggingError && (
        <div className="ui negative message login-mobile">
          {loggingError}
        </div>)}
      <h1
      ref={title}
      className="title">
        Inscription
      </h1>
      <p className="text">
        Vous n'avez pas de compte ? On a pourtant comme un air de déjà-vu ... Rejoignez-nous en quelques clics !
      </p>
      {signupError && (
        <div className="ui negative big message signup"
        >
          {signupError}
        </div>)}
      {successSignup && (
        <div className="ui green big message signup ">
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
        <Grid container spacing={2} >
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
                  value={formState.RGPD}
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