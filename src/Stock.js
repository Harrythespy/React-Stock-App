import React, { useState, useEffect } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Button, Badge } from "reactstrap";

function Stock() {
  
  const [rowData, setRowData] = useState([]);

  const columns = [
      { headerName: "Symbol", field: "symbol"},
      { headerName: "Name", field: "name"},
      { headerName: "Industry", field: "industry"},
  ];

  const gridOptions = {
    columnDefs: columns,
    defaultColDef: {
      width: 300,
      filter: true,
      sortable: true,
    },
  };

  useEffect(() => {
    fetch("http://131.181.190.87:3001/all")
      .then(res => res.json())
      .then(stocks => stocks.map( stock => {
        return {
            symbol: stock.symbol,
            name: stock.name,
            industry: stock.industry
          };
        })
      )
      .then(stocks => setRowData(stocks));
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="search-section">
          <div className="stock">
            <h3>Select Stock</h3>
            <input />
          </div>
          <button className="btn btn-primary">Search</button>
          <div className="industry">
            <h3>Industry</h3>
            <input />
          </div>
        </div>
        <p>
          <Badge color="success">{rowData.length}</Badge> Stocks in the Dataset.
        </p>
        <div 
          className="ag-theme-balham"
          style={{
            height: "600px",
            width: "85vh",
          }}
        >
          <AgGridReact 
            columnDefs={columns}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default Stock;
