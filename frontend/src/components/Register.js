import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        detailedAddress: '',
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
            if (response.data.available) {
                alert('아이디 사용 가능');
            } else {
                alert('아이디가 이미 사용 중입니다.');
            }
        } catch (error) {
            console.error('아이디 확인 중 오류가 발생했습니다!', error);
        }
    };

    const sendVerificationCode = async () => {
        try {
            await axios.post('http://localhost:3001/api/user/send-code', { phone: form.phone });
            alert('인증 코드가 전송되었습니다!');
        } catch (error) {
            console.error('인증 코드를 전송하는 동안 오류가 발생했습니다!', error);
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/user/verify-code', { code: verificationCode });
            if (response.status === 200) {
                setIsVerified(true);
                alert('전화번호가 확인되었습니다!');
            }
        } catch (error) {
            console.error('코드 확인 중 오류가 발생했습니다!', error);
            alert('인증 코드가 잘못되었습니다!');
        }
    };

    const validateForm = () => {
        const usernameRegex = /^[a-zA-Z0-9]{8,20}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,20}$/;
        // const phoneRegex = /^(010\d{4}\d{4}|010-\d{4}-\d{4})$/;
        const vehicleNumberPrefixRegex = /^[0-9]{2,3}$/;
        const vehicleNumberSuffixRegex = /^\d{4}$/;

        if (!usernameRegex.test(form.username)) {
            alert("아이디는 8~20자 길이여야 합니다.");
            return false;
        }

        if (!passwordRegex.test(form.password)) {
            alert("비밀번호는 대문자 하나 이상과 특수 문자 하나를 포함하여 4~20자 길이여야 합니다.");
            return false;
        }

        // if (!phoneRegex.test(form.phone)) {
        //     alert("Phone number must be in the format 01000000000 or 010-0000-0000.");
        //     return false;
        // }

        if (!vehicleNumberPrefixRegex.test(form.vehicleNumberPrefix)) {
            alert("차량 앞 번호는 2~3자리여야 합니다.");
            return false;
        }

        if (!vehicleNumberSuffixRegex.test(form.vehicleNumberSuffix)) {
            alert("차량 뒷 번호는 4자리여야 합니다.");
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
            alert("비밀번호가 일치하지 않습니다!");
            return;
        }

        if (usernameAvailable === false) {
            alert("아이디가 이미 사용 중입니다!");
            return;
        }

        if (!isVerified) {
            alert("전화번호가 확인되지 않았습니다!");
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
            alert('회원가입 성공!');
            navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
        } catch (error) {
            console.error('등록하는 동안 오류가 발생했습니다!', error);
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

    const nextStep = () => {
        if (step === 1) {
            // Validate first step inputs
            if (!form.username || !form.password || !form.confirmPassword || !form.address) {
                alert('입력란을 모두 기입해 주세요.');
                return;
            }
        } else if (step === 2) {
            // Validate second step inputs
            if (!form.phone || !verificationCode) {
                alert('입력란을 모두 기입해 주세요.');
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="register-container">
            <h2>회원가입</h2>
            <div className="status">
                <div className={`step-indicator ${step === 1 ? 'active' : ''}`}></div>
                <div className={`step-indicator ${step === 2 ? 'active' : ''}`}></div>
                <div className={`step-indicator ${step === 3 ? 'active' : ''}`}></div>
            </div>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="step active">
                        <div className="input-group">
                            <label>아이디:</label>
                            <div className="input-with-button">
                                <input type="text" name="username" value={form.username} onChange={handleChange} required maxLength="20" placeholder='8 ~ 20글자'/>
                                <button type="button" className="btn check-btn" onClick={checkUsernameAvailability}>중복확인</button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>비밀번호:</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} required maxLength="20" placeholder='4 ~ 20글자'/>
                        </div>
                        <div className="input-group">
                            <label>비밀번호 확인:</label>
                            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required maxLength="20" placeholder='비밀번호 확인'/>
                        </div>
                        <div className="input-group">
                            <label>주소:</label>
                            <div className="input-with-button">
                                <input type="text" name="address" value={form.address} onChange={handleChange} readOnly required />
                                <button type="button" className="btn search-btn" onClick={handleAddressSearch}>검색</button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>상세 주소 (선택사항):</label>
                            <input type="text" name="detailedAddress" value={form.detailedAddress} onChange={handleChange} placeholder='(선택사항)'/>
                        </div>
                        <div className="button-group">
                            <button type="button" className="btn next-btn" onClick={nextStep}>다음</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step active">
                        <div className="input-group">
                            <label>전화번호:</label>
                            <div className="input-with-button">
                                <input type="text" name="phone" value={form.phone} onChange={handleChange} required placeholder='전화번호 ( - 빼고 입력)'/>
                                <button type="button" className="btn check-btn" onClick={sendVerificationCode}>코드전송</button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>인증코드:</label>
                            <div className="input-with-button">
                                <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required placeholder='확인 코드'/>
                                <button type="button" className="btn check-btn" onClick={verifyCode}>인증확인</button>
                            </div>
                        </div>
                        <div className="button-group">
                            <button type="button" className="btn prev-btn" onClick={prevStep}>이전</button>
                            <button type="button" className="btn next-btn" onClick={nextStep}>다음</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step active">
                        <div className="input-group">
                            <label>차 이름:</label>
                            <input type="text" name="vehicleName" value={form.vehicleName} onChange={handleChange} required/>
                        </div>
                        <div className="input-group">
                            <label>차종:</label>
                            <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                                <option value="승용차">승용차</option>
                                <option value="승합차">승합차</option>
                                <option value="화물차">화물차</option>
                                <option value="오토바이">오토바이</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>차 번호:</label>
                            <input type="text" name="vehicleNumberPrefix" value={form.vehicleNumberPrefix} onChange={handleChange} required />
                            <select name="vehicleNumberMiddle" value={form.vehicleNumberMiddle} onChange={handleChange} required>
                                <option value="">선택</option>
                                {vehicleNumberMiddleOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <input type="text" name="vehicleNumberSuffix" value={form.vehicleNumberSuffix} onChange={handleChange} required/>
                        </div>
                        <div className="button-group">
                            <button type="button" className="btn prev-btn" onClick={prevStep}>이전</button>
                            <button type="submit" className="btn submit-btn">회원가입</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;