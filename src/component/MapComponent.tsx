import React, {useState} from 'react'
import {DirectionsRenderer, GoogleMap, Marker, Polygon} from '@react-google-maps/api';
import {Button, Card, Modal, Image, List, Grid, Checkbox, Label, Header} from "semantic-ui-react";
import arrayMove from "array-move";
import {axiosGetCrowded, getCrowdedJson} from "../api/axios";


const containerStyle = {
    width: '1550px',
    height: '800px'
};

function MapComponent(props: { places: google.maps.places.PlaceResult[] | null, timeCallBack(time: number): void; }) {
    const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [modalStatus, setModalStatus] = useState(false);
    const [timelineItems, setTimelineItems] = useState<google.maps.places.PlaceResult[]>([]);
    const [startItem, setStartItem] = useState<string | undefined>(undefined);
    const [distanceItems, setDistanceItems] = useState<any[]>([]);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    React.useEffect(() => {
        let timeSpent = 0;
        const averageTimeSpent = 1500;

        for (const item of distanceItems) {
            timeSpent += item.duration.value;
            timeSpent += averageTimeSpent;
        }
        props.timeCallBack(timeSpent);
    }, [distanceItems])

    React.useEffect(() => {
        if (props?.places) {
            setModalStatus(true);
        }
    }, [props.places])


    React.useEffect(() => {
        navigator?.geolocation?.getCurrentPosition((pos) => {
            setUserPosition({lat: pos.coords.latitude, lng: pos.coords.longitude})
        });

    }, []);

    function getCenter() {
        if (timelineItems?.length > 0) {
            if (timelineItems[0] && timelineItems[0].geometry?.location) {
                return timelineItems[0].geometry.location;
            }
        }
        if (userPosition) {
            return userPosition
        }
    }

    async function getPhoto(photos: google.maps.places.PlacePhoto[] | undefined) {
        if (photos?.length) {
            return await photos[0] ? photos[0].getUrl({maxHeight: 500, maxWidth: 500}) : ''
        }
        return '';
    }

    function cardItems() {
        const items: any[] = [];
        if (props?.places) {
            for (const place of props.places) {
                // skip item in item list
                if (!!timelineItems.find((item) => {
                    return item.place_id === place.place_id;
                })) {
                    continue;
                }

                items.push(
                    <List.Item><Card>
                        <Image
                            src={getPhoto(place.photos)}
                            wrapped ui={false}/>
                        <Card.Content>
                            <Card.Header>{place.name}</Card.Header>
                            <Card.Meta>{place.formatted_address}</Card.Meta>
                            <Card.Description>
                                {place?.types?.join(', ')}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => {
                                    setTimelineItems([...timelineItems, place]);
                                }}>
                                    Add place to timeline
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                    </List.Item>
                )
            }
        }
        return items;
    }

    const selfModal = (
        <Modal
            dimmer={'inverted'}
            open={modalStatus}
            onClose={() => setModalStatus(false)}
            closeIcon
        >
            <Modal.Header>Add a place</Modal.Header>
            <Modal.Content>
                <List>
                    {cardItems()}
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button negative>
                    Disagree
                </Button>
                <Button positive>
                    Agree
                </Button>
            </Modal.Actions>
        </Modal>
    )

    function sendToStart(place_id: string | undefined) {
        if (place_id) {
            const index = timelineItems.findIndex((item) => {
                return item.place_id === place_id;
            })
            if (index !== -1) {
                setTimelineItems(arrayMove(timelineItems, index, 0))
            }
        }
    }

    function getGridItems() {
        const items: any[] = [];
        for (const place of timelineItems) {
            items.push(
                <Grid.Column>
                    <Card>
                        <Image
                            src={getPhoto(place.photos)}
                            wrapped ui={false}/>
                        <Card.Content>
                            <Card.Header>{place.name}</Card.Header>
                            <Card.Meta>{place.formatted_address}</Card.Meta>
                            <Card.Description>
                                {place?.types?.join(', ')}
                            </Card.Description>
                            <Checkbox label={'Start'} checked={startItem === place.place_id}
                                      onClick={() => {
                                          setStartItem(place.place_id);
                                          sendToStart(place.place_id);
                                      }}/>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={() => {
                                    const index = timelineItems.findIndex((timeItem) => {
                                        return timeItem.place_id === place.place_id;
                                    });
                                    const stateItems = timelineItems;
                                    stateItems.splice(index, 1);
                                    setTimelineItems(stateItems);
                                }}>
                                    Remove from timeline
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            );
        }
        return items;
    }

    function getDistanceItems() {
        const items: any[] = [];
        for (const item of distanceItems) {
            items.push(
                <Grid.Column>
                    <Header sub>Distance</Header>
                    <span>{item.distance.text}</span>
                    <Header sub>Duration</Header>
                    <span>{item.duration.text}</span>
                </Grid.Column>)
        }
        return items;
    }

    function loadMarkers() {
        const markers: any[] = [];
        timelineItems.forEach((item) => {
            const location = item.geometry?.location ? item.geometry.location : {lat: 0, lng: 0}
            markers.push(
                <Marker
                    position={location}
                    label={item.name}
                    title={item.name}
                >
                </Marker>
            );
        });
        return markers;
    }

    function loadPolygons() {
        const polygons: any[] = [];
        const crowdedJson = getCrowdedJson();
        for (const item of crowdedJson) {
            const options = {
                fillColor: "lightblue",
                fillOpacity: 0.20,
                strokeColor: "red",
                strokeOpacity: 0.80,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: false,
                geodesic: false,
                zIndex: 1
            }
            if (item.crowd_level === -1) {
                options.fillColor = 'lightgreen';
                options.strokeColor = 'green';
            }
            if (item.crowd_level === 0) {
                options.fillColor = 'lightorange';
                options.strokeColor = 'orange';
            }
            if (item.crowd_level > 0) {
                options.fillColor = 'lightRed';
                options.strokeColor = 'red';
            }


            const path = item.geo.coordinates.map((list: any) => {
                return list.map((entry: any) => {
                    return {lat: entry[1], lng: entry[0]}
                });
            })
            polygons.push(
                <Polygon
                    paths={path}
                    options={options}
                />
            )
        }
        return polygons;
    }

    function getRequest(): google.maps.DistanceMatrixRequest {
        const destinations = [];
        const origins = [];
        for (const items of timelineItems) {
            const lng = items.geometry?.location.lng() ? items.geometry.location.lng() : 0;
            const lat = items.geometry?.location.lat() ? items.geometry.location.lat() : 0;
            destinations.push({lng, lat});
            origins.push({lng, lat});
        }
        return {travelMode: 'WALKING', destinations, origins} as google.maps.DistanceMatrixRequest
    }

    function sortItems() {
        const service = new google.maps.DistanceMatrixService();
        const request = getRequest();
        const sortedItems: any[] = [];
        const distanceItems: any[] = [];
        service.getDistanceMatrix(request, response => {
            if (response) {
                let current = 0;
                let skipList = [current];
                sortedItems.push(timelineItems[current]);
                while (sortedItems.length < timelineItems.length) { // get next closest
                    const row = response.rows[current] // current row
                    let distanceValue = -1;
                    let distanceIndex = -1;

                    for (let i = 0; i < row.elements.length; i++) {
                        if (i === current) {
                            continue;
                        }
                        if (skipList.findIndex((item) => {
                            return item === i;
                        }) !== -1) {
                            continue;
                        }

                        if (distanceValue === -1) {
                            distanceIndex = i;
                            distanceValue = row.elements[i].distance.value;
                        }
                        if (row.elements[i].distance.value <= distanceValue) {
                            distanceIndex = i;
                            distanceValue = row.elements[i].distance.value;
                        }
                    }


                    current = distanceIndex;
                    skipList = [...skipList, current];
                    distanceItems.push(row.elements[current]);
                    sortedItems.push(timelineItems[current]);
                }
                setTimelineItems(sortedItems);
                setDistanceItems(distanceItems);
            }
        });
    }

    async function getDirections() {
        const DirectionsService = new google.maps.DirectionsService();
        const origin = timelineItems[0]?.geometry?.location ? timelineItems[0].geometry.location : null;
        const destinationItem = timelineItems[timelineItems.length - 1];
        const destination = destinationItem?.geometry?.location ? destinationItem.geometry.location : null;
        const waypoints: any[] = [];

        for (let i = 1; i < timelineItems.length; i++) {
            if (i === timelineItems.length - 1) {
                continue;
            }
            const item = timelineItems[i];
            if (item?.geometry?.location) {
                const waypoint = {
                    stopover: true,
                    location: {lat: item.geometry.location.lat(), lng: item.geometry.location.lng()}
                }
                waypoints.push(waypoint);
            }
        }

        if (origin && destination) {
            DirectionsService.route({
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.WALKING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }

    return (
        <div>
            {selfModal}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={getCenter()}
                zoom={12}
            >
                {loadMarkers()}
                {loadPolygons()}
                {directions && <DirectionsRenderer directions={directions}/>}

                <></>
            </GoogleMap>
            <div style={{marginLeft: '50px'}}>
                <h3>Timeline</h3>
                <Button onClick={() => sortItems()}>Sort timeline</Button>
                <Button onClick={() => getDirections()}>Get directions</Button>
                <span>{' '}</span>
                <Grid columns={'equal'}>
                    <Grid.Row stretched>
                        {getGridItems()}
                    </Grid.Row>
                    <Grid.Row stretched>
                        {getDistanceItems()}
                    </Grid.Row>
                </Grid>
            </div>
        </div>

    )
}

export default React.memo(MapComponent)
