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
        { headerName: "Symbol", field: "symbol", width: 100},
        { headerName: "Name", field: "name", width: 300},
        { headerName: "Industry", field: "industry", width: 300},
      ],
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

  // function symbolFilter(stocks, search="") {
  //   // This is for searching the symbol
  //   if (search.length === 0) {
  //     return stocks;
  //   } else {
  //     stocks.filter(stock => {
  //       return stock.symbol.toLowerCase().includes(search.toLowerCase());
  //     });
  //   }
  // }

  // function industryFilter(stocks, select="") {
  //   // This is for Selecting the industry
  //   if (select.length === 0) {
  //     return stocks;
  //   }
  //   else {
  //     var _stocks = [];
  //     console.log(`Current Industry: ${select}`);
  //     stocks.filter(stock => {
  //       const match = stock.industry.includes(select);
  //       return match;
  //     });
  //     return _stocks;
  //   }
  // }

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
    var searchResults = stocks.filter(stock => {
      return stock.symbol.toLowerCase().includes(search.toLowerCase());
    });
    // Filter the stocks when the dependencies are changed
    if (select === "") {
      setFilterStocks(searchResults);
    } else {
      var _stocks = [];
      // check if there's value in search bar
      console.log(`Current Industry: ${select}`);
      search === ""? _stocks=[...stocks]: _stocks=searchResults;
      _stocks = _stocks.filter( stock => {
        const match = stock.industry.includes(select);
        return match;
      });
      setFilterStocks(_stocks);
    }
  }, [search, stocks, select]);

  if (error) {
    // Check if there's no error when fetching data
    return <p>Something went wrong: { error.message }</p>;
  }

  if(loading) {
      return <p>Loading..</p>;
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
        <div 
        className="ag-theme-balham table-container"
        style={{
            height: "300px",
            width: "71.5vh",
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
      </div>
    </div>
  );
}

export default Stock;
