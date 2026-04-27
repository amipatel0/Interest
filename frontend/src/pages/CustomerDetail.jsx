import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FileText, PlusCircle, CheckCircle, Edit, Trash2, Phone, MapPin } from 'lucide-react';
import api from '../api/api';
import moment from 'moment';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [paymentData, setPaymentData] = useState({
        paid_amount: '', payment_date: moment().format('YYYY-MM-DD')
    });

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const { data } = await api.get(`/customers/${id}`);
            setCustomer(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/customers/${id}/payments`, paymentData);
            setShowPayment(false);
            setPaymentData({ paid_amount: '', payment_date: moment().format('YYYY-MM-DD') });
            fetchCustomer();
        } catch (err) {
            alert('Payment failed');
        }
    };

    const downloadPDF = async () => {
        try {
            const response = await api.get(`/customers/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `${customer.name ? customer.name.replace(/\s+/g, '_') : 'Statement'}_Statement.pdf`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('PDF generation failed');
        }
    };

    const toggleStatus = async (s) => {
        await api.put(`/customers/${id}/status`, { status: s });
        fetchCustomer();
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to completely delete this customer? This will erase all their payments and calculations permanently.")) {
            try {
                await api.delete(`/customers/${id}`);
                navigate('/customers');
            } catch (e) { alert("Failed to delete"); }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/customers/${id}`, editData);
            setShowEdit(false);
            fetchCustomer();
        } catch (err) { alert("Failed to update"); }
    };

    const openEditModal = () => {
        setEditData({
            name: customer.name || '',
            phone: customer.phone || '',
            address: customer.address || '',
            amount: customer.amount || '',
            interest_rate: customer.interest_rate || '',
            duration: customer.duration || ''
        });
        setShowEdit(true);
    };

    if (!customer) return <div className="p-4 text-center">Loading...</div>;

    const calc = customer.interest_calculation || {};
    const payments = customer.payments || [];
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount), 0);
    const remaining_amount = parseFloat(calc.total_amount || 0) - totalPaid;

    const statusColors = { paid: 'success', pending: 'warning', overdue: 'danger' };

    const formatDuration = (months) => {
        const m = parseInt(months, 10);
        if (isNaN(m) || m === 0) return '0 Months';
        const years = Math.floor(m / 12);
        const remainingMonths = m % 12;

        let result = [];
        if (years > 0) result.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
        if (remainingMonths > 0) result.push(`${remainingMonths} ${remainingMonths === 1 ? 'Mo' : 'Months'}`);
        return result.join(' ');
    };

    return (
        <div>
            <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                    {customer.photo && <img src={customer.photo} alt="Customer" className="rounded-circle shadow-sm mt-1" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />}
                    <div className="flex-grow-1">
                        <h3 className="mb-2 fw-bold" style={{ wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.2', color: '#2e1065' }}>{customer.name}</h3>
                        <div className="d-flex gap-2">
                            <button onClick={openEditModal} className="btn btn-sm btn-light border-0 shadow-sm rounded-circle text-primary d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}><Edit size={16} /></button>
                            <button onClick={handleDelete} className="btn btn-sm border-0 bg-danger bg-opacity-10 shadow-sm rounded-circle text-danger d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}><Trash2 size={16} /></button>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-2 flex-wrap bg-white p-2 rounded-4 shadow-sm border border-light">
                    {['paid', 'pending', 'overdue'].map(s => (
                        <Badge
                            key={s}
                            bg={customer.status === s ? statusColors[s] : 'secondary'}
                            className={`rounded-pill flex-fill px-0 py-2 text-uppercase text-center ${customer.status !== s ? 'opacity-50' : ''}`}
                            onClick={() => toggleStatus(s)}
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        >
                            {s}
                        </Badge>
                    ))}
                </div>
            </div>

            <Card className="card-summary p-4 mb-4">
                <div className="text-center mb-3">
                    <small className="text-white-50">Total Payable Amount</small>
                    <h2 className="mb-0">₹ {Number(calc.total_amount).toLocaleString('en-IN')}</h2>
                    <small className="text-warning">Remaining: ₹ {Number(remaining_amount > 0 ? remaining_amount : 0).toLocaleString('en-IN')}</small>
                </div>
                <hr className="bg-white my-2 opacity-25" />
                <div className="row text-center text-sm">
                    <div className="col-4">
                        <small className="text-white-50 d-block">Monthly Interest</small>
                        <span className="fw-bold">₹ {Number(calc.monthly_interest).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="col-4 border-start border-end border-light border-opacity-25">
                        <small className="text-white-50 d-block">Yearly Interest</small>
                        <span className="fw-bold">₹ {Number(calc.yearly_interest).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="col-4">
                        <small className="text-white-50 d-block">Amount</small>
                        <span className="fw-bold">₹ {Number(customer.amount).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </Card>

            <Card className="mini-card p-4 mb-4">
                <h6 className="fw-bold mb-4" style={{ color: '#475569', letterSpacing: '0.5px' }}>FULL DETAILS</h6>
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}><Phone size={18} className="text-primary" /></div>
                    <div className="flex-grow-1"><span className="text-muted small d-block fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Phone</span><span className="fw-semibold text-dark">{customer.phone}</span></div>
                </div>
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}><MapPin size={18} className="text-success" /></div>
                    <div className="flex-grow-1"><span className="text-muted small d-block fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Home Address</span><span className="fw-semibold text-dark">{customer.address}</span></div>
                </div>
                <div className="row mt-2">
                    <div className="col-6 mb-3">
                        <div className="p-3 bg-light rounded-4 text-center">
                            <span className="text-muted small d-block fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>Interest Rate</span>
                            <span className="fw-bold fs-5 text-primary">{customer.interest_rate}%</span>
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <div className="p-3 bg-light rounded-4 text-center">
                            <span className="text-muted small d-block fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>Duration</span>
                            <span className="fw-bold fs-6 text-dark">{formatDuration(customer.duration)}</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center mb-0 mt-2 p-3 border border-light rounded-4 bg-white">
                    <div className="flex-grow-1"><span className="text-muted small d-block fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Financial Window</span><span className="fw-bold text-secondary small">{customer.start_date ? customer.start_date.split('-').reverse().join('-') : ''} <span className="opacity-50">to</span> {customer.end_date ? customer.end_date.split('-').reverse().join('-') : ''}</span></div>
                </div>
            </Card>

            <div className="d-flex gap-2 mb-4">
                <Button variant="primary" className="flex-fill shadow-sm fw-bold rounded-pill" onClick={() => setShowPayment(true)}>
                    + Record Payment
                </Button>
                <Button variant="outline-primary" className="flex-fill bg-white shadow-sm fw-bold rounded-pill border-2" onClick={downloadPDF}>
                    Print PDF
                </Button>
            </div>

            <h6 className="fw-bold mb-3 ms-1" style={{ color: '#475569', letterSpacing: '0.5px' }}>PAYMENT HISTORY</h6>
            {payments && payments.length > 0 ? (
                <div>
                    {payments.map(p => (
                        <Card key={p.id} className="border-0 shadow-sm p-3 mb-2 rounded-3 border-start border-success border-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <CheckCircle size={16} className="text-success" />
                                        <h6 className="mb-0 fw-bold">₹ {Number(p.paid_amount).toLocaleString('en-IN')}</h6>
                                    </div>
                                    <small className="text-muted">Paid on {p.payment_date ? p.payment_date.split('-').reverse().join('-') : ''}</small>
                                </div>
                                <div className="text-end">
                                    <small className="text-muted d-block">Remaining</small>
                                    <span className="text-primary small fw-bold">₹ {Number(p.remaining_amount).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-0 bg-light p-4 text-center rounded-4"><span className="text-muted small">No payments made yet.</span></Card>
            )}

            <Modal show={showPayment} onHide={() => setShowPayment(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Update Payment Tracking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePaymentSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Paid Amount (₹)</Form.Label>
                            <Form.Control type="number" value={paymentData.paid_amount} onChange={e => setPaymentData({ ...paymentData, paid_amount: e.target.value })} required autoFocus />
                            <Form.Text className="text-muted">Expected target: ₹ {Number(remaining_amount > 0 ? remaining_amount : 0).toLocaleString('en-IN')}</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Payment Date</Form.Label>
                            <Form.Control type="date" value={paymentData.payment_date} onChange={e => setPaymentData({ ...paymentData, payment_date: e.target.value })} required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold">Record Payment</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Edit Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Name</Form.Label>
                            <Form.Control type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Phone</Form.Label>
                            <Form.Control type="tel" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Address</Form.Label>
                            <Form.Control type="text" value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })} />
                        </Form.Group>
                        <div className="row g-2 mb-4">
                            <div className="col-6">
                                <Form.Label className="small fw-bold">Req Amount (₹)</Form.Label>
                                <Form.Control type="number" value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })} required />
                            </div>
                            <div className="col-6">
                                <Form.Label className="small fw-bold">Duration (Mo)</Form.Label>
                                <Form.Control type="number" value={editData.duration} onChange={e => setEditData({ ...editData, duration: e.target.value })} required />
                            </div>
                        </div>
                        <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold">Save Changes</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CustomerDetail;
