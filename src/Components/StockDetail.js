import React, { useState, useEffect } from 'react';
import '../App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { useStockHistories } from '../stock_apis';
import { Label, Col, Row, Badge, Button } from 'reactstrap';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

function Dropdown(props) {
    const [innerHistories, setInnerHistories] = useState([]);
    const [innerSelect, setInnerSelect] = useState("");

    useEffect(() => {
        setInnerHistories(props.histories);
    }, [props]); 

    return (
        <Row>
            <Col xs="6" sm="2" />
            <Col xs="6" sm="8">
                <Row>     
                    <Col xs="5" sm="3">
                        <Label>Search date from</Label>
                    </Col>
                    <Col xs="7" sm="5">
                        <select 
                            className="custom-select"  
                            onChange={e => {
                            setInnerSelect(e.target.value);
                            }}>
                            <option value="">Date</option>
                            {innerHistories.map(history => (
                            <option 
                                key={innerHistories.indexOf(history)} 
                                value={history.timestamp}>
                                {history.timestamp}
                            </option>
                            ))}
                        </select>
                    </Col>
                    <Col sm="4">
                        <Button
                            className="search-button"
                            id="search-button"
                            type="button"
                            onClick={ e => {
                                if(props.onSelectHistory) {
                                    props.onSelectHistory(innerSelect);
                                }
                            }}
                        >
                        Search
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col xs="6" sm="2" />
        </Row>
    );
}

function GridTable(props) {
    const gridOptions = {
        columnDefs: [
            { 
                headerName: "Date", 
                field: "timestamp", 
                width: 150
            },
            { headerName: "Open", field: "open"},
            { headerName: "High", field: "high"},
            { headerName: "Low", field: "low"},
            { headerName: "Close", field: "close"},
            { headerName: "Volumes", field: "volumes"},
        ],
        defaultColDef: {
            width: 100,
            sortable: true,
            filter: true
        }
    };
    
    return (
        <div 
        className="ag-theme-balham"
        style={{
            height: "210px",
            width: "655px",
            textAlign: "left",
        }}
        >
          <AgGridReact 
              rowData={props.histories}
              pagination={true}
              paginationPageSize={5}
              gridOptions={gridOptions}
              reactNext={true}
          />
        </div> 
    );
}
function LineChart(props) {
    const [close, setClose] = useState([]);
    const [time, setTime] = useState([]);
    const data = {
        labels: time,
        datasets: [{
            label: "Price",
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: close
        }]
    };
    useEffect(() => {
        setClose(props.data.map( history => {
            return history.close;
        }));
        setTime(props.data.map( history => {
            return history.timestamp;
        }))
    }, [props]);
    return (
        <Line 
            data={data}
            height={100}
            options={{
                responsive: true,
                title: {
                    display: true,
                    text: "Closing Price",
                    fontSize: 20
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                          display: true,
                          labelString: 'Day'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            labelString: "($)",
                            display: true,
                        },
                        ticks: {
                            beginAtZero:true,
                            min: 0,
                        }
                      }]
                   }
                }
            }
        />
    );
}

function StockDetail(props) {
    const symbol = props.location.search.substring(8);
    const {loading, data, error} = useStockHistories(symbol);
    const [timestamp, setTimestamp] = useState("");
    const [histories, setHistories] = useState([]);
    const [ogTimestamp, setOgTimestamp] = useState([]);
    const [filterHistories, setFilterHistories] = useState([]);
    
    useEffect(() => {
        setHistories(data.filter(history => {
            return history.timestamp = moment(history.timestamp).format("L");
        }));
        setOgTimestamp(data.map( history => {
            return history;
        }));
    }, [data]);
    
    useEffect(() => {
        if(timestamp === "") {
            setFilterHistories(histories)
        } else {
            setFilterHistories(histories.filter(
                history => {
                    return moment(new Date(history.timestamp)).isSameOrAfter(new Date(timestamp));
                })
            );
        }
    }, [timestamp, histories]);

    if(loading) {
        return <div><h1>Loading...</h1></div>;
    }
    if(error) {
        return <div><h2>An error Occurred: {error.message}</h2></div>;
    }
    
    return (
        <div className="App">
            <div className="container stock-container">
                <div style={{flex:1, overflow:"auto"}}>
                    <div>
                        <Dropdown 
                        onSelectHistory={
                            value => setTimestamp(value)
                        }
                        histories={ogTimestamp}/>
                    </div>
                    <hr />
                    <div>
                        <Row>
                            <Col sm={{size:4, offset:3}}>
                                <Label>Showing stocks for {histories[0].name}</Label>
                            </Col>
                            <Col sm={{size:3}}>
                                <Badge color="success">{filterHistories.length}</Badge> rows of data
                            </Col>
                        </Row>
                        <Row>
                            <Col/>
                            <Col>
                                <GridTable histories={filterHistories}/>
                            </Col>
                            <Col/>
                        </Row>
                    </div>
                    <hr/>
                    <div sm={{offset:4}}>
                        <LineChart data={filterHistories}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockDetail;
