import React from 'react';
import './App.css';
import Menus from "./component/Menus";
import {Card, Grid} from "semantic-ui-react";
import MapComponent from "./component/MapComponent";
import {LoadScript} from "@react-google-maps/api";

function App() {
    const apiKey = process.env.REACT_APP_API_KEY
    return (
        <div>
            <LoadScript
                libraries={["places"]}
                googleMapsApiKey={apiKey ? apiKey : ''}
            >
                <Menus><Grid style={{height: '100vh'}}>
                    <Grid.Row style={{height: '80%', backgroundColor: 'red'}}>
                        <Grid.Column width={6}>
                            <div><MapComponent/></div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Card
                                image='/images/avatar/large/elliot.jpg'
                                header='Reach Digital'
                                meta='Koffie'
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Card
                                image='/images/avatar/large/elliot.jpg'
                                header='Reach Digital'
                                meta='Koffie'
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Card
                                image='/images/avatar/large/elliot.jpg'
                                header='Reach Digital'
                                meta='Koffie'
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid></Menus>
            </LoadScript>
        </div>
    );
}

export default App;
