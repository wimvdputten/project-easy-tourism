import React, {useState} from "react";
import {Input} from "semantic-ui-react";
import {axiosGetGeoCode} from "../api/axios";
import {StandaloneSearchBox} from '@react-google-maps/api';

export default function Location(props: { onLocationChange: (geoCode: string) => void }) {
    const [geoCode, setGeoCode] = useState<string>('');
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        navigator?.geolocation?.getCurrentPosition((pos) => {
            axiosGetGeoCode(pos.coords.latitude, pos.coords.longitude).then((result) => {
                if (result.data?.results?.length > 0) {
                    setLoading(false);
                    setGeoCode(result.data.results[0].address_components[2].short_name);
                } else {
                    setLoading(false);
                    setGeoCode('');
                }
            }).catch((res) => {
                setLoading(false);
                setGeoCode('');
            });
        });
    }, []);

    React.useEffect(() => {
        props?.onLocationChange(geoCode);
    }, [geoCode])

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
                    loading={loading}
                />
            </StandaloneSearchBox>
        </div>
    );

}
