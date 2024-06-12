import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExampleComponent = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/example')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div>
            <h1>Example Data from Backend:</h1>
            <p>{data}</p>
        </div>
    );
};

export default ExampleComponent;
