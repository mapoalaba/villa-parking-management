import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        vehicleNumber: '',
        vehicleName: '',
    });

    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });

        if (name === 'username') {
            setUsernameAvailable(null);  // Username 변경 시 상태 초기화
        }
    };

    const checkUsernameAvailability = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/user/check-username', { username: form.username });
            setUsernameAvailable(response.data.available);
        } catch (error) {
            console.error('There was an error checking the username!', error);
        }
    };

    const sendVerificationCode = async () => {
        try {
            await axios.post('http://localhost:3001/api/user/send-code', { phone: form.phone });
            alert('Verification code sent!');
        } catch (error) {
            console.error('There was an error sending the verification code!', error);
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/user/verify-code', { code: verificationCode });
            if (response.status === 200) {
                setIsVerified(true);
                alert('Phone number verified!');
            }
        } catch (error) {
            console.error('There was an error verifying the code!', error);
            alert('Invalid verification code!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (usernameAvailable === false) {
            alert("Username is already taken!");
            return;
        }

        if (!isVerified) {
            alert("Phone number is not verified!");
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/user/register', form);
            alert('Registration successful!');
            navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
        } catch (error) {
            console.error('There was an error during the registration!', error);
        }
    };

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setForm({
                    ...form,
                    address: data.address,
                });
            },
        }).open();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} required />
                <button type="button" onClick={checkUsernameAvailability}>Check Availability</button>
                {usernameAvailable === false && <span>Username is already taken</span>}
                {usernameAvailable === true && <span>Username is available</span>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} required />
                <button type="button" onClick={sendVerificationCode}>Send Verification Code</button>
            </div>
            <div>
                <label>Verification Code:</label>
                <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                <button type="button" onClick={verifyCode}>Verify Code</button>
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} readOnly required />
                <button type="button" onClick={handleAddressSearch}>Search Address</button>
            </div>
            <div>
                <label>Vehicle Number:</label>
                <input type="text" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} required />
            </div>
            <div>
                <label>Vehicle Name:</label>
                <input type="text" name="vehicleName" value={form.vehicleName} onChange={handleChange} required />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
