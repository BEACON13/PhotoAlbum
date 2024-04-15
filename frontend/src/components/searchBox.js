// SearchBox.js
import React from 'react';

const SearchBox = ({ searchValue, setSearchValue, searchPhoto }) => (
    <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <input 
            type="text" 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
                marginRight: '10px',
                padding: '8px',
                border: '2px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                width: '300px',
            }}
            onFocus={(e) => e.target.style.borderColor = '#106ba3'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
        />
        <button 
            onClick={searchPhoto} 
            style={{
                padding: '8px 15px',
                background: '#106ba3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#0e548c'}
            onMouseOut={(e) => e.target.style.background = '#106ba3'}
        >
            Search
        </button>
    </div>
);

export default SearchBox;
