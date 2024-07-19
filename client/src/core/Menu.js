import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { itemTotal } from './cartHelpers';
import './menu-styles.css'; // Make sure to import the CSS file

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' };
    } 
    // else {
    //     return { color: 'white' };
    // }
};

const Menu = ({ history }) => {
    return (
        <div className="navbar">
            <div className="logo">
                <img src="/1-removebg-preview_2.png" alt="BookStore Logo" className="logo-image" />
            </div>
            <ul className="nav-links">
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/')} to="/">HOME</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/shop')} to="/shop">SHOP</Link>
                </li>
                {!isAuthenticated() && (
                    <Fragment>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">LOGIN</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">SIGNUP</Link>
                        </li>
                        <li className="nav-item ml-auto">
                            <Link className="nav-link" style={isActive(history, '/about')} to="/about">ABOUT</Link>
                        </li>
                    </Fragment>
                )}
                {isAuthenticated() && (
                    <Fragment>
                        {isAuthenticated() && isAuthenticated().user.role === 0 && (
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, '/user/dashboard')} to="/user/dashboard">DASHBOARD</Link>
                            </li>
                        )}
                        {isAuthenticated() && isAuthenticated().user.role === 1 && (
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">DASHBOARD</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, '/cart')} to="/cart">
                                CART <sup><small className="cart-badge">{itemTotal()}</small></sup>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, '/about')} to="/about">ABOUT</Link>
                        </li>
                        <li className="nav-item ml-auto">
                            <span className="nav-link" onClick={() => signout(() => {
                                history.push('/');
                            })}>LOGOUT</span>
                        </li>
                    </Fragment>
                )}
            </ul>
        </div>
    );
};

export default withRouter(Menu);
