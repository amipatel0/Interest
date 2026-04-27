import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, PlusCircle, LogOut } from 'lucide-react';
import Calculator from './Calculator';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="mobile-container">
            {/* Top Navigation Frame */}
            <div className="d-flex justify-content-between align-items-center p-3 text-dark bg-white shadow-sm position-sticky top-0" style={{ zIndex: 1040, borderBottom: '1px solid #f3e8ff' }}>
                <h5 className="mb-0 fw-bold" style={{ background: 'linear-gradient(135deg, #56ccf2 0%, #9b51e0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InterestApplication</h5>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm">
                    <LogOut size={18} />
                </button>
            </div>

            <div className="content-wrapper">
                <Outlet />
            </div>
            
            <Calculator />

            <div className="bottom-nav">
                <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/customers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={24} />
                    <span>Customers</span>
                </NavLink>
                <NavLink to="/add-customer" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                    <PlusCircle size={24} />
                    <span>Add</span>
                </NavLink>
            </div>
        </div>
    );
};
export default Layout;
