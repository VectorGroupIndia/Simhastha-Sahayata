
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
 * For this demo, it allows selecting a user from a predefined list to simulate logging in with different roles.
 * This is a key part of the multi-role system demonstration.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { translations } = useLocalization();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleLogin = () => {
    if (selectedUser) {
      login(selectedUser);
      onClose();
      navigate('/dashboard');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translations.auth.loginTitle}>
      <div className="space-y-4">
        <p className="text-gray-600">{translations.auth.loginSubtitle}</p>
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
