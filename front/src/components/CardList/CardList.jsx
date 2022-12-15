//import PropTypes
import PropTypes from 'prop-types';
//import react
import React, { useState, Fragment, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import components
import Card from '../Card/Card';
import LandpageModal from '../LandpageModal/LandpageModal';
//import context
import { AllWinesContext } from '../../Context/AllWinesContext';
//import semantic UI Elements
import { Segment, Input, Form } from 'semantic-ui-react';
//import css
import './cardList.scss';
import { filterWines } from '../../services/WineApi';


function CardList() {

    //* STATE FOR CARDLIST *//
    const { wines } = useContext(AllWinesContext);

     //* MODAL LANDING PAGE *//
    const [isLandpageModalOpen, setIsLangpageModalOpen] = useState(true);
    const [isWarningMessageOpen, setIsWarningMessageOpen] = useState(false);
   
    const handleYesClick = (isRememberMeChecked) => {

        if (isRememberMeChecked) {
            localStorage.setItem('remember-me', true);
        }
        setIsLangpageModalOpen(false)

        setTimeout(() => {
            localStorage.removeItem('remember-me');
        }, "10800000");
    }

    const handleNoClick = () => {
        setIsWarningMessageOpen(true);
    }

    // * NAVIGATE TO DETAILS PAGE * //
    const navigate = useNavigate();
    // Route to details page
    const handleClick = (e) => {
        e.preventDefault();
        const path = `/wine/${e.target.id}`;
        navigate(path);
    }

    //* SEARCHBAR *//
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    // Filter for wines
    const getFilteredWine = () => wines.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
    let filteredWines = getFilteredWine();


    //* filter for winemaker *//

    // *  USE CONTEXT FOR FILTERS BY WINEMAKERS *//
    // Je recupere le state winemakerChecked du context
    const { winemakerChecked } = useContext(AllWinesContext);
  // Je filtre les vins en fonction des checkbox cochées et je retourne les vins qui ont le même nom que le checkbox cochée  
    const filteredMenuWinemaker = filteredWines.filter((wine) => {
       // j'utilise une boucle pour verifier si la checkbox est cochée 
        for (let i = 0; i < winemakerChecked.length; i++) {
            // si la checkbox est cochée et que le nom du winemaker correspond au nom du checkbox alors je retourne le vin
            if (winemakerChecked[i].value === true && wine.winemaker.name === winemakerChecked[i].name) {
                return wine;
            }
        }
    });
    // si la checkbox est cochée alors je retourne filteredWines = filteredMenuWinemaker
    for (let i = 0; i < winemakerChecked.length; i++) {
        if (winemakerChecked[i].value === true) {
            filteredWines = filteredMenuWinemaker;
        }
    }

    //* filter for region *//
    const  { regionChecked } = useContext(AllWinesContext);
    const filteredMenuRegion = filteredWines.filter((wine) => {
        for (let i = 0; i < regionChecked.length; i++) {
            if (regionChecked[i].value === true && wine.region.name === regionChecked[i].name) {
                return wine;
            }
        }
    });
    for (let i = 0; i < regionChecked.length; i++) {
        if (regionChecked[i].value === true) {
            filteredWines = filteredMenuRegion;
        }
    }



    //* filter for color *//
    const { colorChecked } = useContext(AllWinesContext);
    console.log("colorchecked", colorChecked)
    const filteredMenuColor = filteredWines.filter((wine) => {
        for (let i = 0; i < colorChecked.length; i++) {
            if (colorChecked[i].value === true && wine.color === colorChecked[i].color) {
                return wine;
            }
        }
    });

    for (let i = 0; i < colorChecked.length; i++) {
        if (colorChecked[i].value === true) {
            filteredWines = filteredMenuColor;
        }
    }


    return (

        <Fragment>
            {isLandpageModalOpen && (
                <LandpageModal
                    handleYesClick={handleYesClick}
                    handleNoClick={handleNoClick}
                    isWarningMessageOpen={isWarningMessageOpen}
                    setIsWarningMessageOpen={setIsWarningMessageOpen}
                />
            )}

            <div className="searchBar">
                <Segment style={{ width: '70%' }}>
                    <Form >
                        <Input focus fluid icon="search" iconPosition="left" placeholder="Rechercher un vin" onChange={handleSearch} value={search} />
                    </Form>
                </Segment>
            </div>

            <div className="cardList">
                {filteredWines.map(({
                    id, size, color, alcohol, price, name, avatar, winemaker, appellation, culture
                }) => (

                    <Card
                        key={id}
                        size={size}
                        color={color}
                        alcohol={alcohol}
                        culture={culture}
                        price={price}
                        name={name}
                        winemaker={winemaker}
                        appellation={appellation}
                        img={avatar}
                        id={id}
                        handleClick={handleClick}
                    />
                ))}
            </div>
        </Fragment>
    );
}

export default React.memo(CardList);
