import React, { useState } from 'react';
import styles from './UpdatePhotoBox.module.css'; 
import axios from 'axios';


  
const API_GATEWAY_URL = 'https://vq1t61oi2i.execute-api.us-east-1.amazonaws.com/dev';
const API_KEY = 'iNqCnTWTA27YOV2jqEtWN8wNLh6b5XqP8UIS5ctM'

const UploadPhotoBox = () => {
    const [file, setFile] = useState(null);
    const [labels, setLabels] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleLabelsChange = (e) => {
        setLabels(e.target.value);
    };

    const uploadPhoto = () => {
        const labelsArray = labels.split(',').map(label => label.trim()).filter(label => label);
        console.log('File to upload:', file);
        console.log('Labels:', labelsArray);

        if(!file) {
            alert('Please select a file to upload');
            return;
        }

       console.log('File to upload:', file);

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
            const body = event.target.result;

            const headers =  {
                    'Content-Type': file.type,
                    'x-amz-meta-customLabels': labelsArray.join(','),
                    'x-api-key': API_KEY
            }

            axios.put(`${API_GATEWAY_URL}/upload/photos-bucket-2024/${file.name}`, body, {
                headers: headers
            })
            .then(response => {
                console.log('File uploaded successfully:', response);
                alert('File uploaded successfully!');
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                alert('Error uploading file!');
            });
        }
       

        setLabels('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles.inputField}
                />
                <input
                    type="text"
                    placeholder="Enter labels, separated by commas"
                    value={labels}
                    onChange={handleLabelsChange}
                    className={styles.inputField}
                />
            </div>
            <button
                onClick={uploadPhoto}
                className={styles.button}
            >
                Upload
            </button>
        </div>
    );
};

export default UploadPhotoBox;
