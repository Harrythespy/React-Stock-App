import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav className="nav">
            <ul className="nav-links">
                <Link to="/" className="nav-item">
                    <li>Home</li>
                </Link>
                <Link to="/stock" className="nav-item">
                    <li>Stocks</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;
