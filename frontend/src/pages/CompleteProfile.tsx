import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { authAPI } from '../services/api';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loadUser } = useAuthStore();
  const from = (location.state as any)?.from || '/';
  const socialUser = (location.state as any)?.socialUser;

  const [form, setForm] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (socialUser) {
      setForm((f) => ({
        ...f,
        phone: socialUser.phone || '',
        street: socialUser.address?.street || '',
        city: socialUser.address?.city || '',
        state: socialUser.address?.state || '',
        pincode: socialUser.address?.pincode || ''
      }));
      return;
    }

    if (user) {
      setForm((f) => ({
        ...f,
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || ''
      }));
    }
  }, [user, socialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Validate phone (Indian numbers)
      const phoneRx = /^[6-9]\d{9}$/;
      if (!phoneRx.test(form.phone)) {
        setError('Please provide a valid 10-digit Indian phone number starting with 6-9');
        setLoading(false);
        return;
      }

      const payload: any = { phone: form.phone };
      payload.address = { street: form.street, city: form.city, state: form.state, pincode: form.pincode };
      await authAPI.updateProfile(payload);
      await loadUser();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-cream-50 to-orange-50">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Complete your profile</h2>
          <p className="text-sm text-gray-600 mb-6">We just need a few more details to finish setting up your account.</p>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
              <input name="street" value={form.street} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-50">
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
