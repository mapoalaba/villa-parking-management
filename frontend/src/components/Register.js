import React, { useState, useEffect } from 'react';
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
        vehicleType: '승용차',
        vehicleNumberPrefix: '',
        vehicleNumberMiddle: '',
        vehicleNumberSuffix: '',
        vehicleName: ''
    });

    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [vehicleNumberMiddleOptions, setVehicleNumberMiddleOptions] = useState([]);

    useEffect(() => {
        updateVehicleNumberMiddleOptions(form.vehicleType);
    }, [form.vehicleType]);

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

    const updateVehicleNumberMiddleOptions = (vehicleType) => {
        const options = ['가', '나', '다', '라', '마', '거', '너', '더', '러', '머', '고', '노', '도', '로', '모', '구', '누', '두', '루', '무', '바', '사', '아', '자', '허', '하', '호'];
        setVehicleNumberMiddleOptions(options);
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

    const validateForm = () => {
        const usernameRegex = /^[a-zA-Z0-9]{8,20}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,20}$/;
        const phoneRegex = /^(010\d{4}\d{4}|010-\d{4}-\d{4})$/;
        const vehicleNumberPrefixRegex = /^[0-9]{2,3}$/;
        const vehicleNumberSuffixRegex = /^\d{4}$/;

        if (!usernameRegex.test(form.username)) {
            alert("Username must be 8-20 characters long.");
            return false;
        }

        if (!passwordRegex.test(form.password)) {
            alert("Password must be 4-20 characters long, with at least one uppercase letter and one special character.");
            return false;
        }

        if (!phoneRegex.test(form.phone)) {
            alert("Phone number must be in the format 01000000000 or 010-0000-0000.");
            return false;
        }

        if (!vehicleNumberPrefixRegex.test(form.vehicleNumberPrefix)) {
            alert("Vehicle number prefix must be 2-3 digits.");
            return false;
        }

        if (!vehicleNumberSuffixRegex.test(form.vehicleNumberSuffix)) {
            alert("Vehicle number suffix must be 4 digits.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
    
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
    
        const vehicleNumber = `${form.vehicleNumberPrefix}-${form.vehicleNumberMiddle}-${form.vehicleNumberSuffix}`;
        const fullAddress = `${form.address} (${form.detailedAddress})`;
    
        try {
            await axios.post('http://localhost:3001/api/user/register', {
                ...form,
                vehicleNumber,
                address: fullAddress
            });
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
                <input type="text" name="username" value={form.username} onChange={handleChange} required maxLength="20" placeholder='8 ~ 20글자'/>
                <button type="button" onClick={checkUsernameAvailability}>Check Availability</button>
                {usernameAvailable === false && <span>Username is already taken</span>}
                {usernameAvailable === true && <span>Username is available</span>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required maxLength="20" placeholder='4 ~ 20글자'/>
            </div>
            <div>
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required maxLength="20" placeholder='비밀번호 확인'/>
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} required placeholder='전화번호'/>
                <button type="button" onClick={sendVerificationCode}>Send Verification Code</button>
            </div>
            <div>
                <label>Verification Code:</label>
                <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required placeholder='확인 코드'/>
                <button type="button" onClick={verifyCode}>Verify Code</button>
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} readOnly required />
                <button type="button" onClick={handleAddressSearch}>Search Address</button>
            </div>
            <div>
                <label>Detailed Address (Optional):</label>
                <input type="text" name="detailedAddress" value={form.detailedAddress} onChange={handleChange} placeholder='(선택사항)'/>
            </div>

            <div>
                <label>Vehicle Name:</label>
                <input type="text" name="vehicleName" value={form.vehicleName} onChange={handleChange} required placeholder='차 이름'/>
            </div>
            <div>
                <label>Vehicle Number:</label>
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                    <option value="승용차">승용차</option>
                    <option value="승합차">승합차</option>
                    <option value="화물차">화물차</option>
                </select>
                <input type="text" name="vehicleNumberPrefix" value={form.vehicleNumberPrefix} onChange={handleChange} required />
                <select name="vehicleNumberMiddle" value={form.vehicleNumberMiddle} onChange={handleChange} required>
                    <option value="">Select</option>
                    {vehicleNumberMiddleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <input type="text" name="vehicleNumberSuffix" value={form.vehicleNumberSuffix} onChange={handleChange} required/>
            </div>
            <button type="submit">Register</button>
        </form>
    );
    
    
    
};

export default Register;
