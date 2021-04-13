import React, {useState} from "react";
import {Grid, Sidebar, Icon, Button} from "semantic-ui-react";
import Location from "./Location";
import Places from "./Places";
import Time from "./Time";

export default function Menus(props: {
    children: any, time: number, resultCallback(results: google.maps.places.PlaceResult[] | null): void;
}) {
    const [sideBarVisible, setSideBarVisible] = useState<boolean>(true);
    const [location, setLocation] = useState<string>('');


    return (
        <div>
            <Sidebar.Pushable>
                <Sidebar
                    animation='push'
                    visible={sideBarVisible}
                    vertical
                    width={"wide"}
                >
                    <Grid celled padded style={{width: '100%'}}>
                        <Grid.Row>
                            <div><Location onLocationChange={setLocation}/></div>
                        </Grid.Row>
                        <Grid.Row><Places location={location} resultCallback={props.resultCallback}/></Grid.Row>
                        <Grid.Row><Time duration={props.time}/></Grid.Row>
                    </Grid>
                </Sidebar>
                <Sidebar.Pusher>
                    <div style={{width: sideBarVisible ? '90%' : '100%'}}>
                        <div style={{paddingBottom: '15px'}}>
                            <Button icon onClick={() => setSideBarVisible(!sideBarVisible)}>
                                <Icon name={sideBarVisible ? 'arrow left' : 'bars'} size={"large"}/>
                            </Button>
                        </div>
                        {props?.children}
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    )
}
