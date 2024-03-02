import React, { useState, useEffect } from 'react';

const CustomerTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/records?searchTerm=${searchTerm}`);
        const jsonData = await response.json();

        if (Array.isArray(jsonData)) {
          setData(jsonData);
        } else {
          console.error('Unexpected response format from server!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, searchTerm]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const sortData = (key) => {
    let sortedData;
    if (key === 'date') {
      sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (key === 'time') {
      sortedData = [...data].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    } else {
    }
    setData(sortedData);
  };

  const sortDataByDate = () => {
    handleSort('date');
    sortData('date');
  };
  
  const sortDataByTime = () => {
    handleSort('time');
    sortData('time');
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontFamily: "Poppins, sans-serif" }}>CUSTOMER DATA</h2>
      <input
        type="text"
        placeholder="Search by name or location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '80%', padding: '10px 5px', marginBottom: '20px' }}
      />

      <div>
        <button onClick={sortDataByDate} style={{ margin: '0 10px 20px', padding: '10px 20px', borderRadius: '5px', background: '#000', color: '#fff', cursor: 'pointer' }}>Sort by Date</button>
        <button onClick={sortDataByTime} style={{ margin: '0 10px 20px', padding: '10px 20px', borderRadius: '5px', background: '#000', color: '#fff', cursor: 'pointer' }}>Sort by Time</button>
      </div>

      {currentRecords.length > 0 && (
        <table style={{ fontFamily: "Poppins, sans-serif", margin: '0 auto', borderRadius: '10px', border: '1px solid #ccc', textAlign: 'left' }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('customer_name')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Sno</th>
              <th onClick={() => handleSort('customer_name')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Customer Name</th>
              <th onClick={() => handleSort('age')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Age</th>
              <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Phone</th>
              <th onClick={() => handleSort('location')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Location</th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Date</th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{indexOfFirstRecord + index + 1}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{item.customer_name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{item.age}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{item.phone}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{item.location}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{new Date(item.created_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {currentRecords.length === 0 && (
        <p>No data available.</p>
      )}

      <div>
        <button onClick={prevPage} disabled={currentPage === 1} style={{ margin: '10px', padding: '10px 20px', borderRadius: '5px', background: '#000', color: '#fff', cursor: 'pointer' }}>&lt; Prev</button>
        <button onClick={nextPage} style={{ margin: '10px', padding: '10px 20px', borderRadius: '5px', background: '#000', color: '#fff', cursor: 'pointer' }}>Next &gt;</button>
      </div>
    </div>
  );
};

export default CustomerTable;
