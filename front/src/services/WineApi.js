//import axios


import apiInstance from "./instance";



//* Request Api for catch All Wines : * //
export async function fetchAllWines() {
    try {
        const dataWines = await apiInstance.get()
        
        return dataWines; 

} catch (error) {
    console.error(error);
}
}

//get all filter options
export async function filterWines() {
    try {
        const [culture, region, winemaker, style, grapevariety, dish] = await Promise.all ([

            apiInstance.get(`/culture`),
            apiInstance.get(`/region`),
            apiInstance.get(`/winemaker`),
            apiInstance.get(`/style`),
            apiInstance.get(`/grapevariety`),
            apiInstance.get(`/dish`)
       
        ]);

        const dataArray = [culture, region, winemaker, style, grapevariety, dish];
        return dataArray; 

} catch (error) {
    console.error(error);
}
}

//* Request Api for catch One Wine : *//
export async function fetchOneWine(id) {
    const response = await apiInstance.get(`/wine/${id}`);
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








