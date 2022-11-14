// import react
import React, { Fragment, useState} from 'react';
// import Modal
import Modal from '../Modal/Modal';
// import PropTypes
import PropTypes from 'prop-types';
// import Scss
import './updateCard.scss';


// Component Card

function UpdateCard({
    id,
    size,
    color,
    alcohol,
    price,
    name,
    winemaker,
    culture,
    appellation,
    img,
    handleClick,
    handleDeleteClick
}) {

    

    const [ isAddWineToCartModalOpen, setisAddWineToCartModalOpen ] = useState(false);


    

    return (
        <Fragment>

            <Modal
                key={id}
                size={size}
                color={color}
                alcohol={alcohol}
                price={price}
                name={name}
                winemaker={winemaker}
                appellation={appellation}
                img={img}
                id={id}
                isOpen={ isAddWineToCartModalOpen }
                setIsOpen={ setisAddWineToCartModalOpen }
            />



            <div className="card">
                <div className='visual'>
                    <div className="left-card">
                        <p>{size}</p>
                        <p className='degrees'>{`${alcohol}`}%.vol</p>
                    </div>
                    <div className="card-img">
                        <img className="wine-logo" src={img} alt="red-wine" />
                    </div>
                    <div className="right-card">
                        <ul className="card-tag">
                            {culture.map(({name, id}) => (
                                <li key={id} className={`tag-${name}`}>{name}</li>
                            ))}
                        </ul>

                        <p className="price">{price} €</p>
                        
                    </div>
                </div>
                <div className="card-content">
                    <h2 className="winemaker">{winemaker}</h2>
                    <p className="wine-name">" {name} "</p>
                    <p className="wine-region">{appellation}</p>
                    <p className={`tablet-color-${color}`}></p>
                </div>

                <div className="card-price">
                    <button className="update-btn update" id={id} onClick={handleClick}>Modifier</button>
                    
                    <button className="update-btn delete" id={id} onClick={handleDeleteClick}>Supprimer</button>
                </div>
            </div>
        </Fragment>

    );
}

export default React.memo(UpdateCard);


// * PROP-TYPES *//

UpdateCard.propTypes = {
    id: PropTypes.number.isRequired,
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    alcohol: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    winemaker: PropTypes.string.isRequired,
    appellation: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    culture: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
};
