import axios, {AxiosResponse} from "axios";

function getKey() {
    return process.env.REACT_APP_API_KEY;
}

export function axiosGetGeoCode(lat: number, lng: number): Promise<AxiosResponse<any>> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const latlng = `${lat},${lng}`;
    return axios.get(url, {params: {latlng: latlng, key: getKey()}})
}


