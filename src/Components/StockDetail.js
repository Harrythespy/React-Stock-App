import React, { useState, useEffect } from 'react';
import '../App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { useStockHistories } from '../stock_apis';

function StockDetail(props) {
    const symbol = props.location.search.substring(8);
    const { loading, data, error } = useStockHistories(symbol);
    const [histories, setHistories] = useState([]);
    
    useEffect(() => {
        setHistories(data);
    }, [data]);

    if(loading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div>An error Occurred: {error.message}</div>
    }
    
    

    return (
        <div className="App">
        <h1>Stock Detail Page</h1>
        </div>
    );
}

export default StockDetail;
