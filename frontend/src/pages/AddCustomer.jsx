import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { UserPlus, Activity, Camera, Calendar, Hash, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import moment from 'moment';

const AddCustomer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', phone: '', address: '', amount: '', interest_rate: '1', start_date: moment().format('YYYY-MM-DD'), end_date: '', duration: '', payment_method: 'Cash'
    });
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const start = moment(formData.start_date);
            const end = moment(formData.end_date);
            const duration = end.diff(start, 'months');
            setFormData(prev => ({ ...prev, duration: duration > 0 ? duration : 0 }));
        }
    }, [formData.start_date, formData.end_date]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', { ...formData, photo });
            navigate('/customers');
        } catch (err) {
            alert('Failed to add customer');
        }
    };

    return (
        <div className="pb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                <h3 className="mb-0 fw-bold" style={{ color: '#2e1065' }}>New Client</h3>
                <div className="bg-white p-2 rounded-circle shadow-sm border border-light d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                   <UserPlus size={20} className="text-primary" />
                </div>
            </div>

            <Card className="mini-card p-4 border-0">
                <Form onSubmit={handleSubmit}>
                    
                    <div className="text-center mb-4">
                        <div className="position-relative d-inline-block">
                            {photo ? (
                                <img src={photo} alt="Preview" className="rounded-circle shadow-sm border border-4 border-white" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            ) : (
                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                    <Camera size={32} className="text-primary opacity-75" />
                                </div>
                            )}
                            <div className="position-absolute bottom-0 end-0 bg-white shadow-sm rounded-circle p-1 overflow-hidden" style={{ cursor: 'pointer', transform: 'translate(10%, 10%)' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="position-absolute top-0 start-0 opacity-0 w-100 h-100" style={{ cursor: 'pointer' }} />
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                                    <Plus size={16} />
                                </div>
                            </div>
                        </div>
                        <Form.Label className="d-block mt-2 small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Profile Photo</Form.Label>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">FULL NAME</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Client's Name" />
                    </Form.Group>
                    
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <Form.Group>
                                <Form.Label className="small fw-bold">PHONE NUMBER</Form.Label>
                                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="000-000-0000" />
                            </Form.Group>
                        </div>
                        <div className="col-6">
                            <Form.Group>
                                <Form.Label className="small fw-bold">LOAN AMOUNT (₹)</Form.Label>
                                <div className="position-relative">
                                    <Hash size={16} className="position-absolute text-muted" style={{ top: '50%', left: '16px', transform: 'translateY(-50%)', zIndex: '5' }} />
                                    <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} required style={{ paddingLeft: '40px' }} placeholder="50000" />
                                </div>
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">HOME ADDRESS</Form.Label>
                        <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} placeholder="Full address" style={{ borderRadius: '16px' }} />
                    </Form.Group>

                    <h6 className="fw-bold mt-4 mb-3 text-primary" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>FINANCIAL METRICS</h6>
                    
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <Form.Group>
                                <Form.Label className="small fw-bold">START DATE</Form.Label>
                                <div className="position-relative">
                                    <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="text-secondary" />
                                </div>
                            </Form.Group>
                        </div>
                        <div className="col-6">
                            <Form.Group>
                                <Form.Label className="small fw-bold">END DATE</Form.Label>
                                <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="text-secondary" />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-4">
                            <Form.Group>
                                <Form.Label className="small fw-bold">DURATION</Form.Label>
                                <Form.Control type="number" name="duration" value={formData.duration} onChange={handleChange} required placeholder="Months" className="bg-light fw-bold" readOnly />
                            </Form.Group>
                        </div>
                        <div className="col-8">
                            <Form.Group>
                                <Form.Label className="small fw-bold">MONTHLY RATE (%)</Form.Label>
                                <Form.Select name="interest_rate" value={formData.interest_rate} onChange={handleChange}>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i+1} value={i+1}>{i+1}% Monthly Rate</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    <Button variant="primary" type="submit" className="w-100 py-3 shadow-lg">CREATE CLIENT PROFILE</Button>
                </Form>
            </Card>
        </div>
    );
};

// Local component since lucide Plus isn't imported at top
import { Plus } from 'lucide-react';
export default AddCustomer;
