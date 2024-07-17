import React from 'react';
import Menu from './Menu';
import Footer from './Footer';
import '../styles.css';

const Layout = ({ className, children }) => {
    return (
        <div>
            <Menu />
            <div className="jumbotron">
                <h2>Good Author & Wonderful plotin one book altogether now.</h2>
                <p className="lead">Discover your next favorite book with us!</p>
            </div>
            <div className={className}>{children}</div>
            <Footer />
        </div>
    );
}

export default Layout;
