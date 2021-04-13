import axios, {AxiosResponse} from "axios";
var drukteArea = require('./drukteArea.json');

function getKey() {
    return process.env.REACT_APP_API_KEY;
}

export function axiosGetGeoCode(lat: number, lng: number): Promise<AxiosResponse<any>> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const latlng = `${lat},${lng}`;
    return axios.get(url, {params: {latlng: latlng, key: getKey()}})
}

export function axiosGetCrowded(): Promise<AxiosResponse<any>> {

    const url = 'https://druktebeeld.amsterdam.nl/api/areas?measured_at=gte.2021-04-13T05:44:00Z'
    return axios(url, {headers: {"Access-Control-Allow-Origin": "https://druktebeeld.amsterdam.nln"}});
}

export function getCrowdedJson() {
        return drukteArea;
}
