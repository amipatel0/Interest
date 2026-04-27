import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Calculator as CalcIcon } from 'lucide-react';

const Calculator = () => {
    const [show, setShow] = useState(false);
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleNum = (num) => {
        setDisplay(display === '0' ? num : display + num);
    };

    const handleOp = (op) => {
        setEquation(display + ' ' + op + ' ');
        setDisplay('0');
    };

    const calculate = () => {
        try {
            // Safe eval using Function
            const result = new Function('return ' + equation + display)();
            setDisplay(String(result));
            setEquation('');
        } catch (e) {
            setDisplay('Error');
        }
    };

    const clear = () => {
        setDisplay('0');
        setEquation('');
    };

    return (
        <>
            <div 
                style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 1050, cursor: 'pointer' }}
                onClick={() => setShow(true)}
                className="floating-btn text-white rounded-circle p-3 d-flex align-items-center justify-content-center"
            >
                <CalcIcon size={24} />
            </div>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title><small>Calculator</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="border-0 shadow-sm bg-dark text-white p-3 mb-2 rounded-3">
                        <div className="text-end text-white-50" style={{minHeight: '20px'}}>{equation}</div>
                        <div className="text-end fs-2 fw-bold" style={{overflow: 'hidden'}}>{display}</div>
                    </Card>
                    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        <Button variant="light" onClick={clear} className="text-danger fw-bold shadow-sm p-3">C</Button>
                        <Button variant="light" onClick={() => handleOp('/')} className="text-primary fw-bold shadow-sm p-3">÷</Button>
                        <Button variant="light" onClick={() => handleOp('*')} className="text-primary fw-bold shadow-sm p-3">×</Button>
                        <Button variant="light" onClick={() => handleOp('-')} className="text-primary fw-bold shadow-sm p-3">-</Button>

                        <Button variant="light" onClick={() => handleNum('7')} className="shadow-sm p-3">7</Button>
                        <Button variant="light" onClick={() => handleNum('8')} className="shadow-sm p-3">8</Button>
                        <Button variant="light" onClick={() => handleNum('9')} className="shadow-sm p-3">9</Button>
                        <Button variant="light" onClick={() => handleOp('+')} className="text-primary fw-bold shadow-sm p-3 row-span-2" style={{gridRow: 'span 2'}}>+</Button>

                        <Button variant="light" onClick={() => handleNum('4')} className="shadow-sm p-3">4</Button>
                        <Button variant="light" onClick={() => handleNum('5')} className="shadow-sm p-3">5</Button>
                        <Button variant="light" onClick={() => handleNum('6')} className="shadow-sm p-3">6</Button>

                        <Button variant="light" onClick={() => handleNum('1')} className="shadow-sm p-3">1</Button>
                        <Button variant="light" onClick={() => handleNum('2')} className="shadow-sm p-3">2</Button>
                        <Button variant="light" onClick={() => handleNum('3')} className="shadow-sm p-3">3</Button>
                        <Button variant="primary" onClick={calculate} className="fw-bold shadow-sm p-3" style={{gridRow: 'span 2'}}>=</Button>

                        <Button variant="light" onClick={() => handleNum('0')} className="shadow-sm p-3" style={{gridColumn: 'span 2'}}>0</Button>
                        <Button variant="light" onClick={() => handleNum('.')} className="shadow-sm p-3">.</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Calculator;
