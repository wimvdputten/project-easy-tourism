import React, {useState} from "react";
import {Input} from "semantic-ui-react";
import {axiosGetGeoCode} from "../api/axios";
import {StandaloneSearchBox} from '@react-google-maps/api';

export default function Location() {
    const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [geoCode, setGeoCode] = useState<string | null>(null);

    React.useEffect(() => {
        navigator?.geolocation?.getCurrentPosition((pos) => {
            axiosGetGeoCode(pos.coords.latitude, pos.coords.longitude).then((result) => {
                if (result.data?.results?.length > 0) {
                    setGeoCode(result.data.results[0].address_components[2].short_name);
                    setUserPosition({lat: pos.coords.latitude, lng: pos.coords.longitude})
                } else {
                    setGeoCode('');
                }
            }).catch((res) => {
                setGeoCode('');
            });
        });
    }, [])


    //Change to input field
    return (
        <div style={{padding: '15px'}}>
            <h3>Location</h3>
            <StandaloneSearchBox>
                <Input
                    value={geoCode}
                    onChange={(_, data) => {
                        setGeoCode(data.value)
                    }}
                    icon='location arrow'
                    iconPosition='left'
                    placeholder='Location...'
                    loading={geoCode === null}
                />
            </StandaloneSearchBox>
        </div>
    );

}
