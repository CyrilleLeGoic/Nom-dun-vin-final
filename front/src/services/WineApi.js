//import axios
import axios from "axios";
import apiInstance from "./instance";


const baseURL = 'http://vps-e69e82f5.vps.ovh.net/:8080'


//* Request Api for catch All Wines : * //
export async function fetchAllWines() {
    try {
        const [wine] = await Promise.all ([
        axios.get(baseURL),
        ]);
        const dataWines = [wine];
        return dataWines; 

} catch (error) {
    console.error(error);
}
}

//get all filter options
export async function filterWines() {
    try {
        const [culture, region, winemaker, style, grapevariety, dish] = await Promise.all ([

        axios.get(`${baseURL}/culture`),
        axios.get(`${baseURL}/region`),
        axios.get(`${baseURL}/winemaker`),
        axios.get(`${baseURL}/style`),
        axios.get(`${baseURL}/grapevariety`),
        axios.get(`${baseURL}/dish`)
       
        ]);

        const dataArray = [culture, region, winemaker, style, grapevariety, dish];
        return dataArray; 

} catch (error) {
    console.error(error);
}
}

//* Request Api for catch One Wine : *//
export async function fetchOneWine(id) {
    const response = await axios.get(`${baseURL}/wine/${id}`);
    return response.data;
}

//* Request for delete one wine : *//
export async function deleteOneWine(id) {
    const response = await apiInstance.delete(`/admin/wine/${id}`);
    return response.data;
}

//* Request for add wine : *//
export async function addWine(wine) {
    const response = await apiInstance.post(`/admin/wine`, wine);
    return response.data;
}

// * Request for add Tag culture on wine : *//
export async function addTagCultureWine(id, cultureIdList ) {
    const response = await apiInstance.post(`/admin/wine/${id}/culture`, {cultureIdList : cultureIdList} );
    return response.data;
}

// * Request for add Tag dish on wine : *//
export async function addTagDishWine(id, dishIdList ) {
    const response = await apiInstance.post(`/admin/wine/${id}/dish`, {dishIdList : dishIdList} );
    return response.data;
}

// * Request for add Tag grapevariety on wine : *//
export async function addTagGrapevarietyWine(id, grapevarietyIdList ) {
    const response = await apiInstance.post(`/admin/wine/${id}/grapevariety`, {grapeVarietyIdList : grapevarietyIdList} );
    return response.data;
}

//handle finalise order
export async function makeOrder(order) {
    const response = await apiInstance.post('/cart/validate', {cart: order});
    return response.data
}









