import React, {useState} from 'react';
import './App.css';
import Menus from "./component/Menus";
import {Card, Grid} from "semantic-ui-react";
import MapComponent from "./component/MapComponent";
import {LoadScript} from "@react-google-maps/api";

function App() {
    const apiKey = process.env.REACT_APP_API_KEY
    const [places, setPlaces] = useState<any>(null);

    return (
        <div>
            <LoadScript
                libraries={["places"]}
                googleMapsApiKey={apiKey ? apiKey : ''}
            >
                <Menus resultCallback={setPlaces}><Grid style={{height: '100vh'}}>
                    <Grid.Row style={{height: '80%'}}>
                        <div><MapComponent places={places}/></div>
                    </Grid.Row>
                </Grid></Menus>
            </LoadScript>
        </div>
    );
}

export default App;
