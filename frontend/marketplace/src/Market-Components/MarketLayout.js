import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function MarketLayout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}

export default MarketLayout;