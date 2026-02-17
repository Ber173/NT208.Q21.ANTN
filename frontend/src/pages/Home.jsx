import React from 'react';
import { useEffect } from 'react';

function Home(){
    useEffect(() => {
        document.body.className = 'bg1';
    }, [])

    return (
        <div className='home-page'>
            <h1>Home Page</h1>
            <div className="content">
                <p>Welcome to the Home Page!</p>
                <p><a href="/login">Login Page</a></p>
                <p><a href="/register">Register Page</a></p>
            </div>
        </div>
    )
}

export default Home;