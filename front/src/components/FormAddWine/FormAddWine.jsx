// import from React
import React, { useContext, Fragment, useState, useRef } from 'react'
// import Context
import { AllWinesContext } from "../../Context/AllWinesContext";
//Import Reducer
import UseAdminReducer, { getActionSetValue, getActionReset } from "../../reducers/UseAdminReducer";
// import request
import { addWine, addTagCultureWine, addTagDishWine, addTagGrapevarietyWine } from "../../services/WineApi";
// import semantic UI Elements
import { Form, Input, Button, } from 'semantic-ui-react'
// import scss
import './formAddWine.scss';

// FormAddWine component function
function FormAddWine() {

    //Reducer configs
    const { adminState, adminDispatch } = UseAdminReducer();
    const reset = () => adminDispatch(getActionReset());


    const title = useRef(null); 
    const handleScroll = (ref) => {
      title.current.scrollIntoView()
    };

    //States
    const { wines, culture, region, winemaker, grapevariety, dish, fetchWines } = useContext(AllWinesContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    //Form methods
    const handleTextFieldChange = (e) => {
        adminDispatch(getActionSetValue(e.target.name, e.target.value));
    }
    const handleSelectChange = (e) => {
        adminDispatch(getActionSetValue(e.target.name, e.target.value));
    }

    const handleCheckBoxChange = (e) => {
        adminDispatch(getActionSetValue(e.target.name, e.target.checked));
    }

    // * UniqAppellation * //
    const uniqAppellation = [...new Set(wines.map((wine) => wine.appellation))];

    // * UniqColor *//
    const uniqColor = [...new Set(wines.map((wine) => wine.color))];

    // * UniqAvatar *//
    const uniqAvatar = [...new Set(wines.map((wine) => wine.avatar))];
    const colorAvatar = uniqColor.map((color, index) => { return { color: color, avatar: uniqAvatar[index] } })

    //* UniqSize *//
    const uniqSize = [...new Set(wines.map((wine) => wine.size))];

    const wine = {
        name: adminState.name.trim(),
        appellation: adminState.appellation,
        color: adminState.color,
        description: adminState.description.trim(),
        winemaker_id: adminState.winemaker,
        region_id: adminState.region,
        size: adminState.size.trim(),
        vintage: Number(adminState.vintage),
        alcohol: Number(adminState.alcool),
        avatar: adminState.avatar,
        price: Number(adminState.price)
    }

    // we catch all tags in the adminState
    const allTag = [];
    for (const key in adminState) {
        if (adminState[key] === true) {
            allTag.push(key)
        }
    }

    // We verify in adminState if the tag is in the culture table, and we push the id in the cultureTagId array
    let cultureIdList = [];
    for (const key in culture) {
        if (allTag.includes(culture[key].name)) {
            cultureIdList.push(culture[key].id)
        }
    }

    // We verify in adminState if the tag is in the grapevariety table, and we push the id in the grapeVarietyTagId array
    const grapeVarietyIdList = [];
    for (const key in grapevariety) {
        if (allTag.includes(grapevariety[key].name)) {
            grapeVarietyIdList.push(grapevariety[key].id)
        }
    }

    // We verify in adminState if the tag is in the dish table, and we push the id in the dishTagId array
    const dishIdList = [];
    for (const key in dish) {
        if (allTag.includes(dish[key].name)) {
            dishIdList.push(dish[key].id)
        }
    }

    //handle submit for create wine with error and success messages
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        //Create a new wine
        if(!wine.name) {
            setErrorMessage('Veuillez renseigner le nom du vin');
            setSuccessMessage('');
            handleScroll(title);
            return;
        }

        if(!wine.appellation) {
            setErrorMessage(`Veuillez renseigner l'appellation du vin`);
            setSuccessMessage('');
            handleScroll(title); 
            return;
        }
        
        if(!wine.color) {
            setErrorMessage('Veuillez renseigner la couleur du vin');
            setSuccessMessage('');
            handleScroll(title);
            return;
        }

        if(!wine.description) {
            setErrorMessage('Veuillez renseigner une description pour le vin');
            setSuccessMessage('');
            handleScroll(title);
            return;
        }

        if(!wine.size) {
            setErrorMessage('Veuillez renseigner la contenance le vin');
            setSuccessMessage('');
            handleScroll(title);
            return;
        }

        if(!wine.vintage) {
            setErrorMessage(`Veuillez renseigner l'année du vin`);
            setSuccessMessage('');
            handleScroll(title);
            return;
        }

        if(!wine.alcohol) {
            setErrorMessage(`Veuillez renseigner le degrés d'acool du vin`);
            setSuccessMessage('');
            handleScroll(title); 
            return;
        }

        if(!wine.avatar) {
            setErrorMessage(`Veuillez renseigner l'image du vin`);
            setSuccessMessage('');
            handleScroll(title); 
            return;
        }

        if(!wine.alcohol) {
            setErrorMessage(`Veuillez renseigner le degrés d'acool du vin`);
            setSuccessMessage('');
            handleScroll(title);
            return;
        }

        if(!wine.price) {
            setErrorMessage(`Veuillez renseigner le prix du vin`);
            setSuccessMessage('');
            handleScroll(title); 
            return;
        }

        const response = await addWine(wine);
        //associate tags to this wine
        const responseCulture = await addTagCultureWine(response.id, cultureIdList);
        const responseGrapeVariety = await addTagGrapevarietyWine(response.id, grapeVarietyIdList);
        const responseDish = await addTagDishWine(response.id, dishIdList);
        //refresh form and fetch new wine
        reset();
        fetchWines();
        if (response && responseCulture && responseGrapeVariety && responseDish) {
            setSuccessMessage('Le vin a bien été créé et ajouté à la boutique !'); 
        } 
        setErrorMessage(''); 
        handleScroll(title);
    }

    return (
        <Fragment>

            <div className="form-add-wine">
                <h1 
                ref={title}
                className="form-title">Ajouter un vin</h1>
                
                    {successMessage && (
                        <div className="ui green big message ">
                        {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="ui negative big message ">
                        {errorMessage}
                        </div>
                    )}

                <Form onSubmit={handleFormSubmit}>

                    <div className="field">
                        <label>Nom du vin</label>
                        <Form.Field
                            id='form-input-control-first-name'
                            control={Input}
                            placeholder='Nom du vin'
                            name='name'
                            value={adminState.name}
                            onChange={handleTextFieldChange}
                        />
                    </div>

                    <div className="two fields">
                        <div className="field">
                            <label size="large">Appellation</label>
                            <select name="appellation" value={adminState.appellation} onChange={handleSelectChange}>
                                <option value="">Choisir une appellation</option>
                                {uniqAppellation.map((appellation, index) => {
                                    return <option key={index} value={appellation}>{appellation}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label size="large">Couleur du vin</label>
                            <select name="color" value={adminState.color} onChange={handleSelectChange}>
                                <option value="">Choisir une couleur</option>
                                {uniqColor.map((color) => {
                                    return <option key={color} value={color}>{color}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label>Description du vin</label>
                        <textarea
                            name="description"
                            value={adminState.description}
                            onChange={handleTextFieldChange}
                            placeholder="Ce vin en quelques mots..." rows="2"></textarea>
                    </div>

                    <div className="two fields">
                        <div className="field">
                            <label size="large">Vigneron</label>
                            <select name="winemaker" value={adminState.winemaker} onChange={handleSelectChange}>
                                <option value="">Choisir un vigneron</option>
                                {winemaker.map((item) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label size="large">Région du vin</label>
                            <select name="region" value={adminState.region} onChange={handleSelectChange}>
                                <option value="">Choisir une région</option>
                                {region.map((item) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="three fields">
                        <div className="field">
                            <label size="large">Contenance</label>
                            <select name="size" value={adminState.size} onChange={handleSelectChange}>
                                <option value="">Choisir une contenance</option>
                                {uniqSize.map((item) => {
                                    return <option key={item} value={item}>{item}</option>
                                })}
                            </select>
                        </div>

                        <div className="field">
                            <label>Année du vin</label>
                            <Form.Field
                                id='form-input-control-first-name'
                                control={Input}
                                placeholder='Année du vin'
                                size="small"
                                name="vintage"
                                value={adminState.vintage}
                                onChange={handleTextFieldChange}
                            />
                        </div>
                        <div className="field">
                            <label>% Alcool</label>
                            <Form.Field
                                id='form-input-control-first-name'
                                control={Input}
                                placeholder='Exemple : 10'
                                size="small"
                                name="alcool"
                                value={adminState.alcool}
                                onChange={handleTextFieldChange}
                            />
                        </div>
                    </div>
                
                    <div className="field">
                        <label>Le type de culture: </label>
                        {culture.map((item) => (
                            <div key={item.id} className="ui checkbox">
                                <input
                                    id={item.id}
                                    type="checkbox"
                                    name={item.name}
                                    value={item.id}
                                    checked={adminState[item.name]}
                                    onChange={handleCheckBoxChange} />

                                <label>{item.name}</label>
                            </div>
                        ))}
                    </div>

                    <div className="field">
                        <label>Les cépages </label>
                        {grapevariety.map((item) => (
                            <div key={item.id} className="ui checkbox">
                                <input
                                    id={item.id}
                                    type="checkbox"
                                    name={item.name}
                                    value={item.id}
                                    checked={adminState[item.name]}
                                    onChange={handleCheckBoxChange} />

                                <label>{item.name}</label>
                            </div>
                        ))}
                    </div>

                    <div className="field">
                        <label>Ce vin accompagne : </label>
                        {dish.map((item) => (
                            <div key={item.id} className="ui checkbox">
                                <input
                                    id={item.id}
                                    type="checkbox"
                                    name={item.name}
                                    value={item.id}
                                    checked={adminState[item.name]}
                                    onChange={handleCheckBoxChange} />
                                <label>{item.name}</label>
                            </div>
                        ))}
                    </div>
                    <div className="two fields">
                    <div className="field">
                        <label size="large">Sélectionnez l'image pour un vin : </label>
                        <select name="avatar" value={adminState.avatar} onChange={handleSelectChange}>
                            <option value="">Choisir une image</option>
                            {colorAvatar.map((item) => {
                                return <option key={item.avatar} value={item.avatar}>{item.color}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="six wide field">
                    <label>Prix</label>
                    <Form.Field
                        id='form-input-control-first-name'
                        control={Input}
                        width={15}
                        name="price"
                        value={adminState.price}
                        onChange={handleTextFieldChange}
                    />
                </div>

                <div className="two fields">
                    <Form.Field
                        id='form-button-control-public-validate'
                        control={Button}
                        content='Ajouter ce vin'
                        onSubmit={handleFormSubmit}
                    />
                 
                  
                    <Form.Field
                        id='form-button-control-public-reset'
                        control={Button}
                        content='Reset'
                        onClick={reset}
                    />
               </div>
            </Form>
            </div>
        </Fragment>
    )

}

export default FormAddWine;














