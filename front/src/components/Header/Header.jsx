/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
//import from React
import React, { useState, useContext, useEffect } from 'react';
//import from React router dom
import { Link, NavLink, useNavigate } from 'react-router-dom'
//import components
import LoginForm from '../LoginForm/LoginForm';
//Import context
import { loginContext } from '../../Context/loginContext';
//import user Request
import { removeToken } from '../../services/instance'
// import logo
import logo from './logo.png';
import user from './user.png';
//import scss
import './header.scss';

// Component Header
function Header() {

    //* STATES *//
    const [isOpen ,setIsOpen] = useState(false);
    const { isLogged, setIsLogged } = useContext(loginContext);
    const { isRoleAdmin } = useContext(loginContext)

    const navigate = useNavigate();

    //* FUNCTIONS *//

    //handle logout
    const handleLogout = () => {
        setIsLogged(false);
        removeToken();
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        localStorage.removeItem('remember-me');
        navigate('/');
        setIsOpen(false)
    }

    //handle verification of JWT token to stay connected when user refresh page
    const { TokenVerify } = useContext(loginContext);
    useEffect(() => {
        TokenVerify()
    }, [TokenVerify])

    return (
        //création d'une navbar
        <header className="header">
            <nav className="navbar">
                <div className="header_menu">
                    <div>
                        <Link to="/" className="menu-link">
                            <img src={logo} alt="logo nom d'un vin" className="logo" />
                        </Link>
                    </div>
                    <div className="link">
                        <NavLink end to="/" style={({ isActive }) => { return { fontWeight: isActive ? 'bold' : '300' } }} className="tab-link">La Cave</NavLink>

                    </div>
                    {/* <div className="link">
                        <NavLink end to="/winemaker" style={({ isActive }) => { return { fontWeight: isActive ? 'bold' : '300' } }} className="tab-link">Nos Vignerons</NavLink>
                    </div> */}
                </div>
                <div className='button-container'>
                    <div className="menu-login">
                        <LoginForm />
                    </div>

                    {isLogged && (
                        <div className='menu-button'>
                            <Link to='/cart' className="cart-icons " ><i className="shopping bag inverted icon"></i></Link>
                            {isRoleAdmin && (
                            <div>
                                
                                <Link to="/admin" className="dashbord-link dashboard"><i className="edit icon"></i></Link>
                            </div>
                            )}
                            
                            <button
                                type="button"
                                className="header-button"
                                onClick={handleLogout}
                            > Déconnexion
                            </button>
                        </div>


                    )}

                    {!isLogged && (
                        <div className="menu-user">

                            <Link to="/signup" className="tab-user">
                                <img src={user} alt="logo utilisateur" className="logo-user" />
                            </Link>
                        </div>

                    )}

                </div>
            </nav>
        </header>
    );
}

export default React.memo(Header);

