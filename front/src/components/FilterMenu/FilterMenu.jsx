/* eslint-disable react-hooks/exhaustive-deps */

// import React from "react";
import React, { useContext, useEffect } from "react";
// import context
import { AllWinesContext } from "../../Context/AllWinesContext";
// import Menu from react-burger-menu
import { slide as Menu } from "react-burger-menu";
// import Logo
import Logo from "./logo.png";
// import Scss
import "./filterMenu.scss";


// component FilterMenu
const FilterMenu = () => {

    //* FILTER COLOR *//
    // je rempli le state colorChecked avec les couleurs et ajoute une valeur a chaque couleur : false
    const { colorChecked, setColorChecked } = useContext(AllWinesContext);

    // fonction pour changer la valeur de checked a true ou false
    const handleColorChange = (e) => {
        setColorChecked(colorChecked.map((color) => {
            if (color.color === e.target.name) {
                return { ...color, value: !color.value }
            }
            return color;
        }))
    }

    //* FILTER WINEMAKER *//
    const { winemaker, winemakerChecked, setWinemakerChecked } = useContext(AllWinesContext);

    // Je rempli le state winemakerChecked avec les winemakers et ajoute une valeur a chaque winemaker : false 
    useEffect(() => {
        const winemakerChecked = winemaker.map((winemaker) => {

            return { ...winemaker, value: false }
        })
        setWinemakerChecked(winemakerChecked);
    }, [winemaker]);

    // J'utilise une fonction pour changer la valeur de checked a true ou false si le nom du winemaker correspond au nom du checkbox
    const handleWinemakerChange = (e) => {
        setWinemakerChecked(winemakerChecked.map((winemaker) => {
            if (winemaker.name === e.target.name) {
                return { ...winemaker, value: !winemaker.value }
            }
            return winemaker;
        }))
    }

    //* FILTER REGION *//
    const { region, regionChecked, setRegionChecked } = useContext(AllWinesContext);

    
    useEffect(() => {
        const regionChecked = region.map((region) => {
            return { ...region, value: false }
        })
        setRegionChecked(regionChecked);
    }, [region]);
    // fonction pour changer la valeur de checked a true ou false
    const handleRegionChange = (e) => {
        setRegionChecked(regionChecked.map((region) => {
            if (region.name === e.target.name) {
                return { ...region, value: !region.value }
            }
            return region;
        }))
    }

    //* BOUTON RESET FILTER *//


    const handleResetFilter = () => {
        // je remet a false toutes les valeurs de colorChecked et je decoche toutes les checkbox
        setColorChecked(colorChecked.map((color) => {
            return { ...color, value: false, checked: false }

        }))
        // je remet a false toutes les valeurs de winemakerChecked et je decoche toutes les checkbox
        setWinemakerChecked(winemakerChecked.map((winemaker) => {
            return { ...winemaker, value: false }
        }))
        // je remet a false toutes les valeurs de regionChecked et je decoche toutes les checkbox
        setRegionChecked(regionChecked.map((region) => {
            return { ...region, value: false, checked: false }
        }))
    }







    //* RETURN *//
    return (
        <Menu>
            <div className="menu-logo">
                <img src={Logo} className="logo" alt="logo" />
            </div>
            <div className="menu-title">
                <h2>Êtes vous plûtot ?</h2>
            </div>

            <form className="menu-item">
                {colorChecked.map((color) => {
                    return (
                        <div className="menu-item-checkbox" key={color.color}>
                            <input type="checkbox"
                                name={color.color}
                                onChange={handleColorChange}
                                checked = {color.value}
                            />
                            <label htmlFor={color.id}>{color.color}</label>
                        </div>
                    )
                }
                )}

            </form>

            <div className="menu-title">
                <h2>Un vigneron préféré ?</h2>
            </div>
            <form className="menu-item">
                {winemakerChecked.map((winemaker) => {
                    return (
                        <div className="menu-item-checkbox" key={winemaker.id}>
                            <input type="checkbox"
                                name={winemaker.name}
                                onChange={handleWinemakerChange}
                                checked={winemaker.value}
                            />
                            <label>{winemaker.name}</label>
                        </div>
                    )
                }
                )}
            </form>
            <div className="menu-title">
                <h2>Une région particulière ?</h2>
            </div>
            <form className="menu-item">
                {regionChecked.map((region) => {
                    return (
                        <div className="menu-item-checkbox" key={region.id}>
                            <input type="checkbox"
                                name={region.name}
                                onChange={handleRegionChange}
                                checked={region.value}
                            />
                            <label htmlFor={region.id}>{region.name}</label>
                        </div>
                    )
                }
                )}
            </form>
            <button onClick={handleResetFilter} className="menu-button-reset">Réinitialiser mes choix</button>
        </Menu>
    );
};

export default FilterMenu;

