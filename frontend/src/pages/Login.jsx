import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('parth');
  const [password, setPassword] = useState('260793');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid Credentials!');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '20px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
      <Card className="p-4 w-100 border-0 shadow-lg" style={{ maxWidth: '400px', borderRadius: '36px', overflow: 'hidden' }}>
        <div className="text-center mb-4 mt-2">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 position-relative" style={{ width: '80px', height: '80px' }}>
               <div className="position-absolute w-100 h-100 bg-primary opacity-25 rounded-circle top-0 start-0" style={{ filter: 'blur(15px)' }}></div>
               <ShieldCheck size={40} className="text-primary position-relative" />
            </div>
            <h3 className="fw-bold" style={{ color: '#2e1065', letterSpacing: '-0.5px' }}>Admin Portal</h3>
            <p className="text-muted small fw-semibold">Enter your secure credentials</p>
        </div>
        
        {error && <div className="alert alert-danger rounded-4 text-center small fw-bold border-0 bg-danger bg-opacity-10 text-danger py-2">{error}</div>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Username</Form.Label>
            <div className="position-relative">
              
               <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ paddingLeft: '48px' }} placeholder="admin" />
            </div>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Password</Form.Label>
            <div className="position-relative">
               
               <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: '48px' }} placeholder="••••••••" />
            </div>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mt-2 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </Button>
        </Form>
      </Card>
      
      {/* Absolute floating decoration matching the prompt's gradient logic */}
      <div className="position-absolute top-0 end-0 p-5 z-n1 opacity-25">
          <div className="rounded-circle bg-primary" style={{width: '200px', height: '200px', filter: 'blur(50px)'}}></div>
      </div>
      <div className="position-absolute bottom-0 start-0 p-5 z-n1 opacity-25">
          <div className="rounded-circle bg-info" style={{width: '250px', height: '250px', filter: 'blur(60px)'}}></div>
      </div>
    </div>
  );
};

export default Login;
