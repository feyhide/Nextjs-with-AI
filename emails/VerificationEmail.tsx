import React from 'react';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => {
    return (
        <div>
            <h1>Hello, {username}</h1>
            <p>Your verification code is: {otp}</p>
        </div>
    );
};

export default VerificationEmail;
