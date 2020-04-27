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

export function useStockHistories(symbol, from) {
    const [loading, setLoading] = useState(true); 
    const [data, setData] = useState([]); 
    const [error, setError] = useState(null);
    
    useEffect(() => { 
        getStockHistory(symbol, from)
        .then( histories => {
            setData(histories);
            setLoading(false);
        })
          .catch((e) => { 
            setError(e);
            setLoading(false); 
          }); 
        },
    // This blank array are the 'dependencies'
    [symbol, from]);
    return { 
    loading,
    data,
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

function getStockHistory(symbol, from="") {
    const url = `http://131.181.190.87:3001/history?symbol=${symbol}` +
    (from? `&from=${from}`: "")
    return fetch(url)
            .then(res => res.json())
            .then(histories => histories.map( 
                history => {
                    return {
                        timestamp: history.timestamp,
                        symbol: history.symbol,
                        name: history.name,
                        industry: history.industry,
                        open: history.open,
                        high: history.high,
                        low: history.low,
                        close: history.close,
                        volumes: history.volumes
                    };
                }
            ));
}