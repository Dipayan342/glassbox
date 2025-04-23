import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export default function GlassProfile() {
  const [token, setToken] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setToken(res.data.token);
      setError('');
    } catch (err) {
      setError('Login failed. Check your credentials.');
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(res.data);
    } catch (err) {
      setError('Failed to fetch profiles. Are you logged in?');
    }
  };

  useEffect(() => {
    if (token) fetchProfiles();
  }, [token]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">GlassProfile Login</h1>

      {!token ? (
        <div className="space-y-4 max-w-sm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={login}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Customer Profiles</h2>
          <ul className="space-y-2">
            {profiles.map((profile) => (
              <li key={profile._id} className="p-4 bg-white border rounded shadow">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Trust Score:</strong> {profile.trustScore}%</p>
                <p><strong>Segment:</strong> {profile.predictions?.segment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
