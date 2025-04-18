import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../controllers/baseUrl';
import CryptoJS from 'crypto-js'; 

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setErrorMessage(""); 

        try {
            const response = await axios.post(`${baseUrl}login`, {
                password: password,
            });

            console.log('Login Response:', response);

            if (response.data.data && response.data.data.state === true) {
                const authToken: string = response.data.data.token;
                const role: string = response.data.data.role;

                // Encrypt only the role before storing it
                const encryptedRole = CryptoJS.AES.encrypt(role, 'secret_key').toString();

             
                localStorage.setItem('kbh_auth_token', authToken);
                localStorage.setItem('user_role', encryptedRole); 
                localStorage.setItem('loginStatus', 'true');

                // Decrypt the role and log both the token and decrypted role
                const decryptedRole = CryptoJS.AES.decrypt(encryptedRole, 'secret_key').toString(CryptoJS.enc.Utf8);
                console.log("Decrypted Role:", decryptedRole);
                console.log("Auth Token:", authToken);

           
                if (authToken) {
                    navigate('/home');
                }
            } else {
                setErrorMessage("Login failed. Please try again.");
            }

        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="flex flex-col justify-center items-start w-full lg:w-1/2 p-6 lg:p-10">
                <h2 className="text-2xl font-semibold">Login</h2>
                <p className="mt-2 text-gray-600">See your growth and get support!</p>
                <form onSubmit={handleLogin} className="w-full max-w-md">
                    {errorMessage && (
                        <div className="mb-4 text-red-500 font-medium text-sm">{errorMessage}</div>
                    )}
                    <div className="mb-6 mt-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center bg-white">
                <div className="text-center">
                    <h1 className="text-[10rem] lg:text-[18rem] font-bold text-orange-500">KBH</h1>
                    <p className="text-[20px] lg:text-[31.2px] font-bold text-gray-600">
                        BAKING FRESHNESS, LEADING TASTE
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
