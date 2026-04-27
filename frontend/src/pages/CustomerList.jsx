import React, { useState, useEffect } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, UserCircle2, ChevronRight, Activity } from 'lucide-react';
import api from '../api/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const getStatusColor = (status) => {
      if(status === 'paid') return 'success'; 
      if(status === 'pending') return 'warning'; 
      if(status === 'overdue') return 'danger'; 
      return 'secondary';
  }

  return (
    <div className="pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 px-1">
          <h3 className="mb-0 fw-bold" style={{ color: '#2e1065' }}>Customers</h3>
          <div className="bg-white p-2 rounded-circle shadow-sm border border-light d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
             <Activity size={20} className="text-primary" />
          </div>
      </div>

      <Form.Group className="mb-4 position-relative">
       
        <Form.Control 
            type="text" 
            placeholder="Search by client name..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="rounded-pill border-0 shadow-sm ps-5 bg-white"
            style={{ padding: '15px' }}
        />
      </Form.Group>
      
      <div>
        {filtered.map(c => (
          <Card key={c.id} className="list-item-card p-3 mb-3 border-0" onClick={() => navigate(`/customers/${c.id}`)} style={{ cursor: 'pointer' }}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    {c.photo ? (
                        <img src={c.photo} alt="avatar" className="rounded-circle shadow-sm" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                    ) : (
                        <div className="bg-primary bg-opacity-10 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '48px', height: '48px' }}>
                            <UserCircle2 size={24} className="text-primary" />
                        </div>
                    )}
                    <div>
                        <h6 className="mb-0 fw-bold" style={{ color: '#3b0764' }}>{c.name}</h6>
                        <div className="d-flex gap-2 align-items-center mt-1">
                            <small className="text-muted fw-semibold">₹ {Number(c.amount).toLocaleString('en-IN')}</small>
                            <span className="text-muted" style={{ fontSize: '0.6rem' }}>•</span>
                            <small className="text-primary fw-bold">{c.interest_rate}% rate</small>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Badge bg={getStatusColor(c.status)} className="rounded-pill px-3 py-1 shadow-sm text-uppercase" style={{ fontSize: '0.65rem' }}>
                        {c.status}
                    </Badge>
                    <ChevronRight size={18} className="text-muted opacity-50" />
                </div>
            </div>
            
            {(c.status === 'pending' || c.status === 'overdue') && (
               <div className="mt-3 pt-2 border-top border-light d-flex justify-content-between align-items-center">
                    <small className="text-danger fw-semibold" style={{fontSize: '0.75rem'}}>Due Date</small>
                    <small className="fw-bold text-dark">{c.end_date ? c.end_date.split('-').reverse().join('-') : ''}</small>
               </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
            <div className="text-center p-5 opacity-50">
                <Search size={40} className="text-muted mb-2" />
                <p className="fw-bold text-dark mb-0">No clients found.</p>
                <small className="text-muted">Try adjusting your search query.</small>
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
