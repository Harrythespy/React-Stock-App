import React, { useState, useEffect } from 'react';
import '../App.css';
import StockTable from './table';

function Stock() {
  const [search, setSearch] = useState("");

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
        <StockTable />
      </div>
    </div>
  );
}

export default Stock;
