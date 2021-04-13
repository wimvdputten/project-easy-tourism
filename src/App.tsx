import React, {useState} from 'react';
import './App.css';
import Menus from "./component/Menus";
import {Card, Grid} from "semantic-ui-react";
import MapComponent from "./component/MapComponent";
import {LoadScript} from "@react-google-maps/api";

function App() {
    const apiKey = process.env.REACT_APP_API_KEY
    const [places, setPlaces] = useState<any>(null);
    const [time, setTime] = useState(0);
    return (
        <div>
            <LoadScript
                libraries={["places"]}
                googleMapsApiKey={apiKey ? apiKey : ''}
            >
                <div style={{margin: '20px'}}>
                    <Menus resultCallback={setPlaces} time={time}><Grid style={{height: '100vh'}}>
                        <Grid.Row style={{height: '80%'}}>
                            <div><MapComponent places={places} timeCallBack={setTime}/></div>
                        </Grid.Row>
                    </Grid></Menus>
                </div>
            </LoadScript>
        </div>
    );
}

export default App;
