import React, { useState } from 'react';
import Header from '../components/header'
import UpdatePhotoBox from '../components/updatePhotoBox'
import SearchBox from '../components/searchBox';
import styles from './main.module.css'
import axios from 'axios';

const API_GATEWAY_URL = 'https://vq1t61oi2i.execute-api.us-east-1.amazonaws.com/dev';
const API_KEY = 'iNqCnTWTA27YOV2jqEtWN8wNLh6b5XqP8UIS5ctM'

const PHOTO_BUCKET_URL = 'https://photos-bucket-2024.s3.us-east-1.amazonaws.com'

const MainPage = () => {
    const [photoList, setPhotoList] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const search = () => {
        const headers = {
            'x-api-key': API_KEY
        }
        axios.get(API_GATEWAY_URL + '/search?q=' + encodeURIComponent(searchValue), {
            headers: headers
        })
            .then(response => {
                console.log('Search results:', response.data);
                const { results } = response.data.body;
                const photosURLs = []
                for (const photo of results) {
                    photosURLs.push(`${PHOTO_BUCKET_URL}/${photo.url}`)
                }
                console.log('Photos URLs:', photosURLs);
                setPhotoList(photosURLs);
            })
            .catch(error => {
                console.error('Error searching for photos:', error);
                alert('Error searching for photos!');
            });
    }
    const searchPhoto = () => {
        // get response from api
        search()
    }

    const clearResults = () => {
        setPhotoList([]);
    };


    const ResultHeader = () => {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center', 
                marginBottom: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '50%', 
                    maxWidth: '600px', 
                }}>
                    <p style={{
                        fontSize: '18px',
                        color: '#333',
                        fontWeight: 'bold',
                        margin: 0
                    }}>
                        Search Results
                    </p>
                    <button
                        onClick={clearResults}
                        style={{
                            color: '#106ba3',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontSize: '16px',
                            padding: '8px 12px',
                            border: '1px solid #106ba3',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            outline: 'none',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8f0fe'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        Clear
                    </button>
                </div>
        </div>
        )
    }




    return (
        <div className={styles.container}>
            <Header />
            <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} searchPhoto={searchPhoto} />
            <UpdatePhotoBox />
            <ResultHeader />
            {/* Display the list of photos */}
            <div className={styles.photoGrid}>
                {photoList.length > 0 ? photoList.map((url, index) => (
                    <img 
                        key={index} 
                        src={url} 
                        alt="Uploaded" 
                        className={styles.photoItem}
                    />
                )) : 'No photos found'}
            </div>
        </div>
    );
};

export default MainPage;