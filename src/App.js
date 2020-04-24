import React from 'react';
import stocks from './stocks.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import Stock from './Stock';
import Home from './Home';
import StockDetail from './StockDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/stock" component={Stock}/>
          <Route path="/stock/:id" component={StockDetail}/>
        </Switch>
      </div>
    </Router>
  );
}



export default App;
