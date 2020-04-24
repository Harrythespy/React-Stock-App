import React from 'react';
import '../App.css';

import { AiOutlineStock } from 'react-icons/ai';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Prices <AiOutlineStock /></h1>
        {/* <img src={stocks} className="App-logo" alt="stocks" /> */}
        <p>
            Welcome to the Stock Market Page. <br/>
            You may click on stocks to view all the stocks or search to view the latest 100 days of activity.
        </p>
      </header>
    </div>
  );
}

export default Home;
