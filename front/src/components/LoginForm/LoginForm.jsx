//import from React
import React, { useContext, useState, Fragment } from "react";
//import from React router dom
import { Link, useNavigate } from 'react-router-dom';
//import request
import { loginRequest } from "../../services/userRequests";
//import
import { setToken, removeToken } from '../../services/instance'
import { loginContext } from '../../Context/loginContext';
import './LoginForm.scss';

function LoginForm() {
  const { isLogged, setIsLogged } = useContext(loginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { pseudo, setPseudo } = useContext(loginContext);
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const { isRoleAdmin, setIsRoleAdmin } = useContext(loginContext);
  const navigate = useNavigate();

  //Handle login with error message and success set pseudo, connected state + jwt token
  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();
    try {
      const response = await loginRequest(email, password);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      if (response.logged) {
        setIsLogged(true);
        setPseudo(response.pseudo);
        setError('');
        if (response.role === 'admin') {
          setIsRoleAdmin(true);
          navigate('/admin');
        } else {
          navigate('/');
        }
      }

    } catch (error) {
      console.log(error.message)
      setError('mauvais password ou email');
    }
  }

  //handle logout
  const handleLogout = () => {
    setIsLogged(false);
    removeToken();
    localStorage.removeItem('token');
    localStorage.removeItem('remember-me');
    setIsRoleAdmin(false);
    localStorage.removeItem('cart');
    setIsRoleAdmin(false);
    navigate('/');
    setIsOpen(false);
  }

  // Change the value to "true" or "false" when clicking on the "Se connecter" button
  const handleIsOpen = (event) => { event.preventDefault(); setIsOpen(!isOpen); }

  return (
    <div className='login-container'>
      {error && (
        <div className="ui negative message login">
          {error}
        </div>
      )}

      {isLogged && (
        <div className="login-form_logged">
          <div className="login-form_message">
            Bonjour {pseudo} !
          </div>

          {isRoleAdmin && (
            <Link to="/admin" className="dashbord-link">Dashbord  <i className="edit icon"></i></Link>
          )}

          <Link to='/cart' className="cart-icon" >Mon panier<i className="shopping bag inverted icon"></i></Link>

          <button
            type="button"
            className="login-form_button"
            onClick={handleLogout}
          >
            Déconnexion
          </button>

        </div>
      )}

      {(!isLogged && isOpen && (
        <div className="login-form_container">
          <form 
          autoComplete="off" 
          className="form-login" 
          onSubmit={handleSubmitLoginForm} 
          onKeyPress={(e) => {if (e.key === 'Enter') {handleSubmitLoginForm(e);}}}>
            <button className="close" onClick={handleIsOpen}>X</button>

            <div className="form-group">
              <input
                name="email"
                placeholder="Adresse Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="form-group">
              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <button
              type="submit"
              className="form-btn"
            >
              Connexion
            </button>
          </form>
          <Link to="/signup" className="signup-link">Ou s'inscrire</Link>
        </div>
      ))}

      {(!isLogged && !isOpen && (
        <Fragment>
          <Link to="/" onClick={handleIsOpen} className="tab-connexion">Se connecter</Link>
          <Link to="/signup" className="tab-connexion">S'inscrire</Link>
        </Fragment>
      ))}
    </div>
  );
};

export default React.memo(LoginForm);
