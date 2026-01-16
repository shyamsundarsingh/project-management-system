import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { Button, Spinner, Alert, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

export default function ProgramData() {
    const { tableName } = useParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // 🔹 FETCH PROGRAM DATA
    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await API.get(`/programs/${tableName}`);
            const rows = Array.isArray(res.data?.data) ? res.data.data : [];
            setData(rows);
        } catch (err) {
            console.error(err);
            setError('Failed to load program data');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [tableName]);

    // 🔹 CSV UPLOAD
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            setError('');

            await API.post(`/programs/${tableName}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('CSV uploaded successfully');
            setFile(null);
            fetchData();
        } catch (err) {
            console.error(err);
            setError('CSV upload failed. Please check file format.');
        } finally {
            setUploading(false);
        }
    };

    // 🔹 DYNAMIC COLUMNS FOR DATATABLE
    const columns =
        data.length > 0
            ? Object.keys(data[0])
                .filter(k => k !== '_id' && k !== '__v')
                .map(k => ({
                    name: k.replace(/_/g, ' '),
                    selector: row => row[k] ?? '',
                    sortable: true
                }))
            : [];

    // 🔹 FILTERED DATA FOR SEARCH
    const filteredData = data.filter(row =>
        Object.values(row)
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3 className="mb-3">
                Program Data: <span className="text-primary">{tableName}</span>
            </h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex align-items-center gap-2 mb-3">
                <Form.Control
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <input
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files[0])}
                />
                <Button
                    variant="success"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload CSV'}
                </Button>
            </div>

            {loading ? (
                <Spinner animation="border" />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    dense
                />
            )}
        </div>
    );
}
