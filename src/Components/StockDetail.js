import React, { useState, useEffect } from 'react';
import '../App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { getStockHistory } from '../stock_apis';
import { Label, Col, Row } from 'reactstrap';
import moment from 'moment';

function Dropdown(props) {
    const [innerHistories, setInnerHistories] = useState([]);
    const [innerSelect, setInnerSelect] = useState("");

    useEffect(() => {
        setInnerHistories(props.histories);
        if(innerSelect !== "") {
            props.onSelectHistory(innerSelect);
        }
    }, [innerSelect, props]);

    return (
        <div className="hisotry-dropdown">
            <Label>Search date from</Label>
            <Row>
                <Col xs="6" sm="4" />
                <Col xs="6" sm="4">
                    <select 
                        className="custom-select"  
                        onChange={e => {
                        setInnerSelect(e.target.value);
                        }}>
                        <option value=""></option>
                        {innerHistories.map(history => (
                        <option key={innerHistories.indexOf(history)} value={history}>
                            {history}
                        </option>
                        ))}
                    </select>
                </Col>
                <Col sm="4" />
            </Row>
        </div>
    );
}

function GridTable(props) {
    const gridOptions = {
        columnDefs: [
            { 
                headerName: "Date", 
                field: "timestamp", 
                width: 130,
                cellRenderer: (data) => {
                    return moment(data.createdAt).format('L');
                }
            },
            { headerName: "Open", field: "open", width: 100},
            { headerName: "High", field: "high", width: 100},
            { headerName: "Low", field: "low", width: 100},
            { headerName: "Close", field: "close", width: 100},
            { headerName: "Volumes", field: "volumes", width: 100},
        ]
    };
    
    return (
        <div 
        className="ag-theme-balham table-container"
        style={{
            height: "300px",
            width: "65vh",
        }}
        >
          <AgGridReact 
              rowData={props.histories}
              pagination={true}
              paginationAutoPageSize={true}
              gridOptions={gridOptions}
              reactNext={true}
          />
        </div> 
    );
}

function StockDetail(props) {
    const symbol = props.location.search.substring(8);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timestamp, setTimestamp] = useState("");
    const [histories, setHistories] = useState([]);
    const timestamps = histories.map(history => {
        return moment(history.timestamp).format('L');
    });
    useEffect(() => {
        getStockHistory(symbol, timestamp)
            .then(histories => {
                setHistories(histories);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(true);
            });
    }, [histories, timestamp]);
    
    
    if(loading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div>An error Occurred: {error.message}</div>
    }

    return (
        <div className="App">
            <div className="container">
                <h1>Stock Detail Page</h1>
                <Dropdown 
                onSelectHistory={
                    value => setTimestamp(moment(value).format().substring(0,10))
                } 
                histories={timestamps}/>
            </div>
                <Label>Showing stocks for {histories[0].name}</Label>
            <div className="grid-table">
                <GridTable histories={histories}/>
            </div>
        </div>
    );
}

export default StockDetail;
