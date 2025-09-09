import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { DEMO_USERS } from '../constants';
import { User } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The Login Modal.
 * It features a disabled UI for a traditional login/register system,
 * while retaining the functional demo user selection for prototype purposes.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { translations } = useLocalization();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    if (selectedUser) {
      login(selectedUser);
      onClose();
      navigate('/dashboard');
    }
  };

  const TabButton: React.FC<{ tabId: 'login' | 'register', children: React.ReactNode }> = ({ tabId, children }) => (
      <button
        onClick={() => setActiveTab(tabId)}
        className={`w-1/2 py-2.5 text-sm font-medium leading-5 text-center transition-colors duration-150 rounded-t-lg focus:outline-none ${
          activeTab === tabId
            ? 'text-orange-600 border-b-2 border-orange-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {children}
      </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translations.auth.loginTitle}>
      <div className="space-y-4">
        <div className="flex border-b">
            <TabButton tabId="login">{translations.auth.loginTab}</TabButton>
            <TabButton tabId="register">{translations.auth.registerTab}</TabButton>
        </div>

        {/* Tab Content */}
        <div>
            {activeTab === 'login' ? (
                 <div className="space-y-3 p-2 animate-fade-in">
                    <input type="email" placeholder={translations.auth.emailLabel} disabled className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"/>
                    <input type="password" placeholder={translations.auth.passwordLabel} disabled className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"/>
                    <Button className="w-full" disabled>{translations.auth.loginButton}</Button>
                </div>
            ) : (
                <div className="space-y-3 p-2 animate-fade-in">
                    <input type="text" placeholder={translations.auth.nameLabel} disabled className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"/>
                    <input type="email" placeholder={translations.auth.emailLabel} disabled className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"/>
                    <input type="password" placeholder={translations.auth.passwordLabel} disabled className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"/>
                    <Button className="w-full" disabled>{translations.auth.registerButton}</Button>
                </div>
            )}
        </div>

        {/* Demo User Selector */}
        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-gray-500">{translations.auth.demoLoginSeparator}</span>
            </div>
        </div>

        <p className="text-gray-600 text-sm text-center">{translations.auth.loginSubtitle}</p>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {DEMO_USERS.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedUser?.id === user.id ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleLogin} disabled={!selectedUser} className="w-full">
          {translations.auth.loginAs} {selectedUser ? selectedUser.name.split(' ')[0] : '...'}
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;