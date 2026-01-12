
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Allows sending/receiving Cookies (JWT)
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Return data directly if available
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle Session Expiry globally
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('bms_user');
        // Optional: Redirect to login if not already there
        if (window.location.hash !== '#/login') {
            window.location.href = '/#/login';
        }
    }
    console.error("API Error:", error?.response?.data || error.message);
    throw error;
  }
);

export default axiosClient;
