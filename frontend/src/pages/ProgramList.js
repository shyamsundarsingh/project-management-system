import React, { useState, useEffect } from 'react';
import API from '../api';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProgramList() {
    const [programs, setPrograms] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newProgram, setNewProgram] = useState({
        programName: '',
        programManager: '',
        programType: '',
        startDate: '',
        endDate: '',
        status: ''
    });

    const PAGE_SIZE = 5;
    const nav = useNavigate();

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await API.get('/programs');
            // ensure programs is always an array
            setPrograms(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch (err) {
            console.error(err);
            setPrograms([]);
        }
    };

    const filteredPrograms = programs.filter(p =>
        p.programName.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPrograms.length / PAGE_SIZE);
    const paginatedPrograms = filteredPrograms.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleChange = e => {
        setNewProgram({ ...newProgram, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // Automatically generate tableName from programName
            const tableName = newProgram.programName.toLowerCase().replace(/\s+/g, '_');
            await API.post('/programs', { ...newProgram, tableName });

            setShowModal(false);
            setNewProgram({
                programName: '',
                programManager: '',
                programType: '',
                startDate: '',
                endDate: '',
                status: ''
            });

            fetchPrograms();
        } catch (err) {
            console.error(err);
        }
    };

    const handleView = (tableName) => {
        nav(`/programs/${tableName}`);
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Programs</h2>
                <Button onClick={() => setShowModal(true)}>+ Add Program</Button>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search program..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
            />

            {paginatedPrograms.length === 0 ? (
                <p>No programs available.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Program Name</th>
                            <th>Manager</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPrograms.map(p => (
                            <tr key={p._id}>
                                <td>{p.programName}</td>
                                <td>{p.programManager}</td>
                                <td>{p.programType}</td>
                                <td>{p.startDate}</td>
                                <td>{p.endDate}</td>
                                <td>{p.status}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleView(p.tableName)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <Button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="me-2"
                    >
                        Prev
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            variant={page === i + 1 ? 'primary' : 'outline-primary'}
                            onClick={() => setPage(i + 1)}
                            className="me-1"
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="ms-2"
                    >
                        Next
                    </Button>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Program</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Program Name</Form.Label>
                            <Form.Control
                                name="programName"
                                value={newProgram.programName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Program Manager</Form.Label>
                            <Form.Control
                                name="programManager"
                                value={newProgram.programManager}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Program Type</Form.Label>
                            <Form.Control
                                name="programType"
                                value={newProgram.programType}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={newProgram.startDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={newProgram.endDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                name="status"
                                value={newProgram.status}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Add Program
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
