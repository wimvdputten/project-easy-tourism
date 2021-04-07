import React from 'react';
import './App.css';
import Menus from "./component/Menus";
import {Card, Grid} from "semantic-ui-react";

function App() {
    return (
        <div>
            <Menus><Grid style={{height: '100vh'}}>
                <Grid.Row style={{height: '80%', backgroundColor: 'red'}}>
                    <Grid.Column width={6}>
                        <div>content</div>
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
        </div>
    );
}

export default App;
