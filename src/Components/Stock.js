import React, { useState, useEffect } from 'react';
import '../App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Col, Input, Button, Badge, Row } from "reactstrap";
import { useAllStocks } from '../stock_apis';

function SearchBar(props) {
  const [innerSearch, setInnerSearch] = useState("");

  return (
    <Col sm="6">
      <Row>
        <Col sm="6">
          <Input 
            aria-labelledby="search-button"
            placeholder="Search symbol.."
            name="stock-search"
            id="stock-search"
            type="search"
            value={innerSearch}
            onChange={ e => {
              setInnerSearch(e.target.value);
            }}
          />
        </Col>
        <Col sm="3">
          <Button
            className="search-button"
            id="search-button"
            type="button"
            onClick={ e => {
              if (props.onSubmitSearch) {
                  props.onSubmitSearch(innerSearch);
              }
            }}
          >
            Search
          </Button>
        </Col>
        <Col sm="3">
          <Button
            className="search-button"
            id="clear-button"
            type="button"
            onClick={ e => {
              if (props.onSubmitSearch) {
                  props.onSubmitSearch("");
                  setInnerSearch("");
              }
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Col>
  );
}

function DropdownSearch(props) {
  const [innerSelect, setInnerSelect] = useState("");

  useEffect(() => {
    props.onSelectIndustry(innerSelect);
  }, [innerSelect, props]);

  return (
    <Col sm="6">
      <select 
        className="custom-select"  
        onChange={e => {
          setInnerSelect(e.target.value);
        }}>
        <option value="">All Industry</option>
        {props.industries.map(industry => (
          <option key={props.industries.indexOf(industry)} value={industry}>
            {industry}
          </option>
        ))}
      </select>
    </Col>
  );
}

function Stock(props) {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("");
  const { loading, stocks, error } = useAllStocks();
  const [filterStocks, setFilterStocks] = useState([]);
  const [uniqueIndustries, setUniqueIndustries] = useState([]);
  // Attributes for ag-grid-react table
  const gridOptions = {
      columnDefs: [
        { headerName: "Symbol", field: "symbol"},
        { headerName: "Name", field: "name"},
        { headerName: "Industry", field: "industry"},
      ],
      defaultColDef: {
        sortable: true,
        filter: "agTextColumnFilter",
      },
      rowSelection: "single",
      onSelectionChanged: onSelectionChanged,
  };

  function onSelectionChanged() {
    var selectedRow = gridOptions.api.getSelectedRows();
    console.log(selectedRow[0].symbol);
    props.history.push({
      pathname: '/history',
      search: `?symbol=${selectedRow[0].symbol}`
    });
  }

  useEffect(() => {
    var industries = stocks.map( stock => {
      // Return the whole list of industries
      return stock.industry;
    });
    setUniqueIndustries(industries.filter((v, i, s) => {
      return s.indexOf(v) === i;
    }));
  }, [stocks]);

  useEffect(() => {
    
    const symbolResult = stocks.filter(stock => {
      if (search.length === 0){
        return stocks;
      } else {
        return stock.symbol.toLowerCase().includes(search.toLowerCase());
      }
    });

    const industryResult = symbolResult.filter(stock => {
      if (select.length === 0){
        return stocks;
      } else {
        const match = stock.industry.includes(select);
        return match;
      }
    });

    setFilterStocks(industryResult);
  }, [search, stocks, select]);

  if (error) {
    // Check if there's no error when fetching data
    return <div><h2>An error Occurred: {error.message}</h2></div>;
  }

  if(loading) {
    return <div><h1>Loading...</h1></div>;
  }
  
  return (
    <div className="App">
      <div className="container stock-container">
        <div className="search-row">
          <Row>
            <Col sm="2"/>
            <Col sm="8">
              <Row>
                <SearchBar onSubmitSearch={ value => setSearch(value) } />
                <DropdownSearch onSelectIndustry={value => setSelect(value)} industries={uniqueIndustries} />
              </Row>
            </Col>
            <Col sm="2"/>
          </Row>
        </div>
        <hr/>
        <p>
            <Badge color="success">{filterStocks.length}</Badge> Stocks in the Dataset.
        </p>
        <Row>
          <Col/>
          <Col>
            <div 
              className="ag-theme-balham"
              style={{
                  height: 300,
                  width: 600,
                  textAlign: "left"
              }}
            >
              <AgGridReact 
                  rowData={filterStocks}
                  pagination={true}
                  paginationPageSize={8}
                  gridOptions={gridOptions}
                  reactNext={true}
              />
            </div> 
          </Col>
          <Col/>
        </Row>   
      </div>
    </div>
  );
}

export default Stock;
