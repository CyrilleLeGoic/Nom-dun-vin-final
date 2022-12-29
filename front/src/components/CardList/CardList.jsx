/* eslint-disable array-callback-return */

//import react
import React, { useState, Fragment, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import components
import Card from '../Card/Card';
import LandpageModal from '../LandpageModal/LandpageModal';
//import context
import { AllWinesContext } from '../../Context/AllWinesContext';
// import services
import { fetchAllWines } from '../../services/WineApi.js';

//import semantic UI Elements
import { Segment, Input, Form } from 'semantic-ui-react';
//import css
import './cardList.scss';



function CardList() {

        // Create state for allWines
        const [wines, setWines] = useState([]);

        const fetchWines = async () => {
            const response = await fetchAllWines();
            setWines(response.data);
        }
        // useEffect for fetch data from API
        useEffect(() => { fetchWines() }, []);


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

    // State for searchbar
    const [search, setSearch] = useState('');
    // This function catch the value of the searchbar in the state search
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    // This function filter the wines by name
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


// maintenant j'utilise un for pour parcourir 
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
// 
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
                        onClick={handleClick}
                    />
                ))}
            </div>
        </Fragment>
    );
}

export default React.memo(CardList);
