//import from React
import React, { useEffect, useState, useContext } from 'react';
//import from React router dom
import { useParams, useNavigate } from 'react-router-dom';
//import components
import Loading from '../Loading/Loading';
// import request
import { fetchOneWine } from '../../services/WineApi.js';
import { addWineToCart } from '../../utils';
//import context 
import { loginContext } from '../../Context/loginContext';
// import css
import './details.scss';


function Details() {
    // STATES
    const [wine, setWine] = useState({});
    const [isLoadingWine, setIsLoadingWine] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isMessageAddToCartOpen, setIsMessageAddToCartOpen] = useState(false);
    const { isLogged } = useContext(loginContext);
    const [isConnexionMessageOpen, setIsConnexionMessageOpen] = useState(false);

    const navigate = useNavigate();

    // Get id from url with useParams
    const { id } = useParams();

    //handle add wine to cart
    const handleSubmitAddToCart = (e) => {
        e.preventDefault();
        if (isLogged) {
            addWineToCart(wine, quantity);
            setIsMessageAddToCartOpen(true);
        } else {
            setIsConnexionMessageOpen(true);
        }
    }

    //handle loading component to avoid display problem 
    useEffect(() => {
  
        fetchOneWine(id)
            // if response ok set wine to response and isLoading to false
            .then((response) => {
                setWine(response);
                setIsLoadingWine(false);
            })
            // if error navigate to error page 404
            .catch((error) => {
                console.log(error);
                navigate('/error');
            });
    }, [id, navigate]);

    // if isLoadingWine is true we display Loading component    
    if (isLoadingWine) {
        return <Loading />
    }


    return (
        <div className="details">
            <div className="details-container-visual">
                <div className="details-img">
                    <div className=''>
                        <p className='details-size'>{wine.size}</p>
                    </div>
                    <img className="wine-img" src={wine.avatar} alt="Logo wine" />
                    <ul className="details-tag">

                        {wine.culture.map((item) => (
                            <li key={item.id} className={`details-${item.name}`}>{item.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="details-cart">

                    <div className="details-content">
                        <div>
                            <h2 className="details-winemaker">{wine.winemaker.name}</h2>
                        </div>
                        <p className="details-wine-name">" {wine.name} "</p>
                        <p className="details-wine-region">{wine.appellation}</p>
                        <div className='details-color'>
                            <p className={`tablet-color-${wine.color}`}></p>
                        </div>
                        <p className="details-price"> {wine.price}€ <span>T.T.C</span> </p>
                    </div>

                    {isMessageAddToCartOpen &&
                        <div className="ui green message">Bien ajouté au panier</div>
                    }

                    {isConnexionMessageOpen &&
                        <div className="ui negative message addToCart">
                            <i className="close icon" onClick={() => setIsConnexionMessageOpen(false)}></i>
                            <div className="header-message">
                                Connectez-vous pour ajouter un vin au panier
                            </div>
                        </div>
                    }

                    <form className="details-form" onSubmit={handleSubmitAddToCart}>
                        <input className="details-input" type="number" value={quantity} onChange={(e) => (setQuantity(e.target.value))} name="quantity" placeholder="0" min="1" max="50" />
                        <button type='submit' className="details-btn">Ajouter au panier</button>
                    </form>

                </div>
            </div>

            <div className="details-container-information">
                <div className="details-reviews">
                    <h2 className="details-reviews-title">Notre avis sur ce vin...</h2>
                    <p className="details-reviews-content">{wine.description}</p>
                    <h2 className="details-dish-title">Quel menu accompagne-t-il ?</h2>
                    <div className="dishcontainer">
                        {wine.dishes.map((item) => (
                            <span key={item.id} className="details-dish-content">{item.name}</span>
                        ))}
                    </div>
                </div>

                <div className="details-features">


                    <table className="table">
                        <thead>
                            <tr className="pair">
                                <th className="type case">Type de vin</th>
                                <td className="case">{wine.color}</td>
                            </tr>
                            <tr className="">
                                <th className="type case">Appellation</th>
                                <td className="case">{wine.appellation}</td>
                            </tr>
                            <tr className="pair">
                                <th className="type case">Cépages</th>
                                <td className="case">{wine.grapevarieties.map((item) => (
                                    <span key={item.id}> {`${item.name}, `}</span>
                                ))}</td>
                            </tr>
                            <tr className="">
                                <th className="type case">Domaine</th>
                                <td className="case">{wine.winemaker.name}</td>
                            </tr>
                            <tr className="pair">
                                <th className="type case">Région</th>
                                <td className="case">Région de {wine.region.name}</td>
                            </tr>
                            <tr className="">
                                <th className="type case">Millésime</th>
                                <td className="case">{wine.vintage}</td>
                            </tr>
                            <tr className="pair">
                                <th className="type case">Agriculture</th>
                                <td className="case">{wine.culture.map((item) => (
                                    <span key={item.id}> {`${item.name}, `}</span>
                                ))}</td>
                            </tr>
                            <tr className="">
                                <th className="type case">Contenance</th>
                                <td className="case">{wine.size}</td>
                            </tr>
                            <tr className="pair">
                                <th className="type case">Alcool</th>
                                <td className="case">{wine.alcohol} %.vol</td>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div>

        </div>
    )
}

export default React.memo(Details);