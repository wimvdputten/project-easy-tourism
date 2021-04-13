import React, {useState} from "react";
import {Grid, Input} from "semantic-ui-react";
import {start} from "repl";

export default function Time(props: { duration: number }) {
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');


    React.useEffect(() => {
        if (startTime) {
            calculateTime(true, startTime);
        }
    }, [props, props.duration])

    function calculateTime(start: boolean, value: any) {
        if (value !== '' && props.duration) {
            if (start) {
                const startTime = new Date();
                startTime.setHours(value.substring(0, 2), value.substring(3, 5));
                startTime.setSeconds(startTime.getSeconds() + props.duration + 7200);
                setEndTime(startTime.toISOString().substring(11, 16));
            } else {
                const endTime = new Date();
                endTime.setHours(value.substring(0, 2), value.substring(3, 5));
                endTime.setSeconds(endTime.getSeconds() - props.duration + 7200);
                setStartTime(endTime.toISOString().substring(11, 16));
            }
        }


    }

    return (
        <div style={{padding: '15px'}}>
            <h3>Timeframe</h3>
            <Grid columns={2}>
                <Grid.Row><Grid.Column>Start time</Grid.Column><Grid.Column>End time</Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column> <Input
                    type='time'
                    iconPosition='left'
                    placeholder='Start time'
                    value={startTime}
                    onChange={((event, data) => {
                        calculateTime(true, data.value);
                        setStartTime(data.value);
                    })}
                /></Grid.Column>
                    <Grid.Column> <Input
                        type='time'
                        iconPosition='left'
                        placeholder='End time'
                        value={endTime}
                        onChange={((event, data) => {
                            calculateTime(false, data.value);
                            setEndTime(data.value);
                        })}
                    /></Grid.Column></Grid.Row>
            </Grid>


        </div>
    );
}
