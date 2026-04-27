import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Wallet, Users, TrendingUp, Activity } from 'lucide-react';
import api from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalCustomers: 0, totalAmountGiven: 0, totalInterestExpected: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/customers/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 px-1">
          <h3 className="mb-0 fw-bold" style={{ color: '#2e1065' }}>Overview</h3>
          <div className="bg-white p-2 rounded-circle shadow-sm border border-light d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
             <Activity size={20} className="text-primary" />
          </div>
      </div>

      <Card className="card-summary p-4 mb-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
                <small className="text-white opacity-75 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Total Capital Given</small>
                <h1 className="mb-0 mt-1 fw-bold text-truncate" style={{ fontSize: '2.4rem' }}>
                    ₹ {Number(stats.totalAmountGiven).toLocaleString('en-IN')}
                </h1>
            </div>
            <div className="bg-white bg-opacity-25 p-2 rounded-circle flex-shrink-0 ms-2 d-flex align-items-center justify-content-center" style={{ width: '46px', height: '46px' }}>
                <Wallet size={24} className="text-white" />
            </div>
        </div>
        <div className="d-flex align-items-center mt-2">
            <div className="bg-white bg-opacity-25 px-3 py-1 rounded-pill small fw-semibold">
                Active Capital
            </div>
        </div>
      </Card>
      
      <h6 className="fw-bold mb-3 ms-1" style={{ color: '#475569', letterSpacing: '0.5px' }}>ANALYTICS</h6>
      
      <div className="row g-3">
        <div className="col-6">
          <Card className="mini-card p-4 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start mb-3">
               <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                  <Users size={22} className="text-primary" />
               </div>
            </div>
            <div>
                <h3 className="mb-1 text-primary fw-bold" style={{ fontSize: '2rem' }}>{stats.totalCustomers}</h3>
                <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Total Customers</small>
            </div>
          </Card>
        </div>
        <div className="col-6">
          <Card className="mini-card p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-3">
               <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                  <TrendingUp size={22} className="text-success" />
               </div>
            </div>
            <div>
                <h3 className="mb-1 text-success fw-bold text-truncate" style={{ fontSize: '1.4rem' }}>
                    ₹ {Number(stats.totalInterestExpected).toLocaleString('en-IN')}
                </h3>
                <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Expected Interest</small>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
