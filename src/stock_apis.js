import { useState, useEffect } from 'react';

export function useAllStocks() {
    const [loading, setLoading] = useState(true); 
    const [stocks, setStocks] = useState([]); 
    const [error, setError] = useState(null);
    
    useEffect(() => { 
        getStocks()
        .then( stocks => {
            setStocks(stocks);
            setLoading(false);
        })
          .catch((e) => { 
            setError(e);
            setLoading(false); 
          }); 
        },
    // This blank array are the 'dependencies'
    []);
    return { 
    loading,
    stocks,
    error, 
    };
}

function getStocks() {
    return fetch("http://131.181.190.87:3001/all")
        .then(res => res.json())
        .then(stocks => stocks.map( stock => {
            return {
                symbol: stock.symbol,
                name: stock.name,
                industry: stock.industry
                };
            })
        );
}