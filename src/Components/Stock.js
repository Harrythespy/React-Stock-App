import React, { useState, useEffect } from 'react';
import '../App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Col, Input, Button, Badge } from "reactstrap";
import { useAllStocks } from '../stock_apis';

function SearchBar(props) {
  const [innerSearch, setInnerSearch] = useState("");

  return (
    <div className="search-bar">
      <Col sm={8}>
        <Input 
          aria-labelledby="search-button"
          placeholder="Search.."
          name="stock-search"
          id="stock-search"
          type="search"
          value={innerSearch}
          onChange={ e => {
            setInnerSearch(e.target.value);
          }}
        />
      </Col>
      <Button
        sm={6}
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
      <Button
        sm={6}
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
    </div>
  );
}

function DropdownSearch(props) {
  const [innerSelect, setInnerSelect] = useState("");

  useEffect(() => {
    props.onSelectIndustry(innerSelect);
  }, [innerSelect]);

  return (
    <Col sm={8}>
      <select 
        className="custom-select"  
        onChange={e => {
          setInnerSelect(e.target.value);
        }}>
        <option value=""></option>
        {props.industries.map(industry => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>
    </Col>
  );
}

function Stock() {
  const [search, setSearch] = useState("");
  // const [select, setSelect] = useState("");
  const { loading, stocks, error } = useAllStocks();
  const [filterStocks, setFilterStocks] = useState([]);
  
  // Columns and Headers in the table
  const columns = [
      { headerName: "Symbol", field: "symbol", width: 100},
      { headerName: "Name", field: "name", width: 300},
      { headerName: "Industry", field: "industry", width: 300},
  ];
  // Attributes for ag-grid-react table
  const gridOptions = {
      columnDefs: columns,
      defaultColDef: {
      // filter: true,
      // sortable: true,
      },
  };

  var industries = stocks.map( stock => {
    // Return the whole list of industries
    return stock.industry;
  });
  var uniqueIndustries = industries.filter((v, i, s) => {
    return s.indexOf(v) === i;
  });

  
  // Retrieve unique values of industry array
  
  
  const filteredValue = (value) => {
    if(value === "") {
      console.log("no industry");
      setFilterStocks([...stocks]);
    } else {
      let _stocks = [];
      // check if there's value in search bar
      search === ""? _stocks=[...stocks]: _stocks=[...filterStocks];
      _stocks = _stocks.filter( stock => {
        const match = stock.industry.includes(value);
        return match;
      });
      setFilterStocks(_stocks);
    }
  }

  useEffect(() => {
    // Filter the stocks when the dependencies are changed
    setFilterStocks(
      stocks.filter(stock => {
        return stock.symbol.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, stocks]);
  
  if (error) {
    // Check if there's no error when fetching data
    return <p>Something went wrong: { error.message }</p>;
  }

  if(loading) {
      return <p>Loading..</p>;
  }
  

  return (
    <div className="App">
      <div className="container">
        <SearchBar onSubmitSearch={ value => setSearch(value) } />
        <DropdownSearch onSelectIndustry={filteredValue} industries={uniqueIndustries} />
        <p>
            <Badge color="success">{filterStocks.length}</Badge> Stocks in the Dataset.
        </p>
        <div 
        className="ag-theme-balham table-container"
        style={{
            height: "610px",
            width: "71.5vh",
        }}
        >
          <AgGridReact 
              columnDefs={columns}
              rowData={filterStocks}
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
