// import from react
import { createContext, useState, useEffect } from 'react';
// import services
import { fetchAllWines, filterWines } from '../services/WineApi.js';

// Create context
export const AllWinesContext = createContext();
// Create Provider for Share informations between components
export const AllWinesProvider = ({ children }) => {

        // Create state for allWines
        const [wines, setWines] = useState([]);
 
        const fetchWines = async () => {
            const response = await fetchAllWines();
            setWines(response[0].data);
        }
        // useEffect for fetch data from API
        useEffect(() => { fetchWines() }, []);


    //STATE CULTURE
    const [culture, setCulture] = useState([]);
    //STATE REGION
    const [region, setRegion] = useState([]);
    //STATE WINEMAKER
    const [winemaker, setWinemaker] = useState([]);
    // STATE GRAPEVARIETY
    const [grapevariety, setGrapeVariety] = useState([]);
    // STATE DISH
    const [dish, setDish] = useState([]);

    const fecthFiltersWines = async () => {
        const response = await filterWines();
        setCulture(response[0].data);
        setRegion(response[1].data);
        setWinemaker(response[2].data);
        setGrapeVariety(response[4].data);
        setDish(response[5].data);
    }
    useEffect(() => { fecthFiltersWines() }, []);



    const [colorChecked, setColorChecked] = useState(

        [{
            color: "rouge", value: false
        }, {
            color: "blanc", value: false
        }, {
            color: "rosé", value: false
        }]
    )

    // checkbox winemaker state 
    const [winemakerChecked, setWinemakerChecked] = useState([]);
    // checkbox region state 
    const [regionChecked, setRegionChecked] = useState([]);



    // Create function for choose and share informations between components
    return (
        <AllWinesContext.Provider value={{ winemaker, wines, grapevariety, dish, region, culture, winemakerChecked, setWinemakerChecked, regionChecked, setRegionChecked, colorChecked, setColorChecked }}>
            {children}
        </AllWinesContext.Provider>
    );
}
