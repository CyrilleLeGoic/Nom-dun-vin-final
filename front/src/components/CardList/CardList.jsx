//import PropTypes
import PropTypes from 'prop-types';
//import react
import React, { useState, Fragment, useContext } from 'react';
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

    //* USE CONTEXT FOR FILTERS BY COLOR *//
    const { checkboxColor } = useContext(AllWinesContext);

    // filter for wines, loop on checkboxColor and return wines with checked value
    const filteredMenu = filteredWines.filter((wine) => {
        // use loop for check if checkbox is checked
        for (let i = 0; i < checkboxColor.length; i++) {
            // if checkbox is checked return wines with color checked
            if (checkboxColor[i].value === true && wine.color === checkboxColor[i].color) {
                // return filtered wines
                return wine;
            }
        }
    });
    // if checkbox is checked return filteredWines = filteredMenu
    for (let i = 0; i < checkboxColor.length; i++) {
        if (checkboxColor[i].value === true) {
            filteredWines = filteredMenu;
        }
    }

    // *  USE CONTEXT FOR FILTERS BY WINEMAKERS *//
    const { checkboxWinemaker } = useContext(AllWinesContext);
    // filter for wines, loop on checkboxWinemaker and return wines with checked value  
    const filteredMenuWinemaker = filteredWines.filter((wine) => {
        // use loop for check if checkbox is checked
        for (let i = 0; i < checkboxWinemaker.length; i++) {
            // if checkbox is checked return wines with winemaker checked
            if (checkboxWinemaker[i].value === true && wine.winemaker.name === checkboxWinemaker[i].winemaker) {
                // return filtered wines
                return wine;
            }
        }
    });
    // if checkbox is checked return filteredWines = filteredMenuWinemaker
    for (let i = 0; i < checkboxWinemaker.length; i++) {
        if (checkboxWinemaker[i].value === true) {
            filteredWines = filteredMenuWinemaker;
        }
    }

    // * USE CONTEXT FOR FILTERS BY REGION *//
    const { checkboxRegion } = useContext(AllWinesContext);
    // filter for wines, loop on checkboxRegion and return wines with checked value
    const filteredMenuRegion = filteredWines.filter( wine => {
        // use loop for check if checkbox is checked
        for (let i = 0; i < checkboxRegion.length; i++) {
            // if checkbox is checked return wines with region checked
            if (checkboxRegion[i].value === true && wine.region.name === checkboxRegion[i].region) {
                // return filtered wines
                return wine;
            }
        }
    });

    // if checkbox is checked return filteredWines = filteredMenuRegion
    for (let i = 0; i < checkboxRegion.length; i++) {
        if (checkboxRegion[i].value === true) {
            filteredWines = filteredMenuRegion;
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
