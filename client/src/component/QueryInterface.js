import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const filterOptions = [
    'Level',
    'Message',
    'ResourceID',
    'Timestamp',
    'TraceID',
    'SpanID',
    'Commit',
    'ParentResourceID',
];

const QueryInterface = ({ isLoggedIn }) => {
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
    const [filterValue, setFilterValue] = useState('');
    const [filterValue2, setFilterValue2] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Added state for admin status

    useEffect(() => {
        if (!isLoggedIn) {
            // User is not logged in, navigate to the login page
            window.location = '/login';
        } else {
            // Fetch logs or perform other actions
            fetchLogs();

            // Check if the user is an admin
            checkIfUserIsAdmin();
        }
    }, [isLoggedIn]);

    const checkIfUserIsAdmin = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user-details', {
                headers: {
                    'x-auth-token': token,
                },
            });
            const user = response.data.user;
            setIsAdmin(user.role === 'admin');
        } catch (error) {
            console.error('Error checking user role:', error.message);
        }
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setFilterValue('');
        setFilterValue2('');
    };

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [columns, setColumns] = useState([]);
    const [pending, setPending] = React.useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setColumns([
                { name: 'Level', selector: 'level', sortable: true },
                { name: 'Message', selector: 'message', sortable: true },
                { name: 'Resource ID', selector: 'resourceId', sortable: true },
                { name: 'Timestamp', selector: 'timestamp', sortable: true },
                { name: 'Trace ID', selector: 'traceId', sortable: true },
                { name: 'Span ID', selector: 'spanId', sortable: true },
                { name: 'Commit', selector: 'commit', sortable: true },
                { name: 'Parent Resource ID', selector: 'parentResourceId', sortable: true },
            ]);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api', {
                params: {
                    [selectedFilter.toLowerCase()]: filterValue,
                    "timestamp2": filterValue2,
                },
            });
            setResults(response.data.map((ll) => ({ parentResourceId: ll.metadata.parentResourceId, ...ll })));
            console.log(results);
        } catch (error) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 shadow-md m-0">
            <h1 className="text-3xl font-bold mb-4 text-center bg-blue-500 p-2 rounded-md m-0 text-white shadow-md">Log Query Interface</h1>
            <div className="bg-gray-200 p-4 rounded-md mb-4 shadow-lg ">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Select Filter:</label>
                        <select
                            className="border rounded-md p-2 w-full"
                            onChange={(e) => handleFilterChange(e.target.value)}
                            value={selectedFilter}
                        >
                            {filterOptions.map((filter) => (
                                <option key={filter} value={filter}>
                                    {filter}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 flex flex-row ">
                        <div className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-600">{selectedFilter != 'Timestamp' ? selectedFilter : "Timestamp Start"}:</label>
                            <input

                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={filterValue}
                                placeholder={"Enter " + `${selectedFilter === 'Timestamp' ? "Timestamp start" : selectedFilter}`}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        </div>
                        {selectedFilter === 'Timestamp' && (
                            <div className='flex flex-col m-auto'>
                                <label className="block text-sm font-medium text-gray-600">Timestamp End:</label>
                                <input
                                    type="text"
                                    className="border rounded-md p-2 w-full"
                                    value={filterValue2}
                                    placeholder='Enter Timestamp end'
                                    onChange={(e) => setFilterValue2(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={fetchLogs}
                    disabled={loading}
                >
                    Filter
                </button>
            </div>
            {isAdmin && (
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Log
                </button>
            )}

            <div>
                <h2 className="text-xl font-bold mb-4">Filtered Results...</h2>
                {loading && <p className="text-gray-700">Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {results.length > 0 && <DataTable columns={columns} data={results} />}
            </div>
        </div>
    );
};

export default QueryInterface;
