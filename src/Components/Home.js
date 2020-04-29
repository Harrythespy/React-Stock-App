import React from 'react';
import '../App.css';

import { AiOutlineStock } from 'react-icons/ai';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>Stock Prices <AiOutlineStock /></h1>
          {/* <img src={stocks} className="App-logo" alt="stocks" /> */}
          <p className="home-page-content">
          Welcome to the Stock Market Page. <br/>
          Please click Stocks to search stocks. <br/>
          You may click on stocks to view all the stocks or search to view the latest 100 days of activity.
          </p>
        </div>
      </header>
    </div>
  );
}

export default Home;
