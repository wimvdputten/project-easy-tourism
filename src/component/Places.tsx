import React, {useState} from "react";
import {Input} from "semantic-ui-react";

export default function Places(props: {
    location: string,
    resultCallback(results: google.maps.places.PlaceResult[] | null): void;
}) {
    const [placeText, setPlaceText] = useState<string>('');

    const getRequest = (queryText: string) => ({
        query: `${queryText} in ${props.location}`,
        fields: ['name', 'geometry', 'icon','photos','place_id', 'types']
    });

    let htmlElement: HTMLDivElement | null = null;

    function searchForPlaces() {
        if (htmlElement) {
            const service = new google.maps.places.PlacesService(htmlElement);
            service.textSearch(
                getRequest(placeText),
                (
                    results: google.maps.places.PlaceResult[] | null,
                ) => {
                    props.resultCallback(results)
                }
            );
        }
    }

    return (
        <div style={{padding: '15px'}}>
            <h3>Places</h3>
            <Input
                icon='map marker alternate'
                iconPosition='left'
                placeholder='Search for places...'
                value={placeText}
                onChange={((e, data) => {
                    setPlaceText(data.value)
                })}
                action={{
                    content: 'Search',
                    onClick: () => {
                        searchForPlaces();
                    }
                }}
            />
            <div ref={e => htmlElement = e}/>
        </div>
    );
}
