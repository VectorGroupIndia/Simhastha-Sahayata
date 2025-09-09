import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';

/**
 * User Profile Page.
 * This component is protected and only accessible to authenticated users.
 * It displays user information and allows for basic profile updates like changing the avatar.
 */
const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { translations } = useLocalization();

  if (!isAuthenticated || !user) {
    // Redirect to home page if not logged in
    return <Navigate to="/" />;
  }

  const handleChangeAvatar = () => {
    // Simulate updating the avatar with a new random image from picsum.photos
    // Using Date.now() as a seed to get a different image each time
    const newAvatarUrl = `https://picsum.photos/seed/${Date.now()}/100/100`;
    updateUser({ avatar: newAvatarUrl });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-6">{translations.profile.title}</h2>
            <div className="relative mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-orange-200"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
            <p className="text-lg text-gray-500 mb-6">{user.role}</p>

            <Button onClick={handleChangeAvatar}>
              {translations.profile.changeAvatar}
            </Button>
          </div>
        </Card>

        <Card>
            <h2 className="text-2xl font-bold mb-4">{translations.profile.settings}</h2>
            <div className="space-y-4">
                {/* Emergency Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{translations.profile.emergencySettings}</h3>
                    <div className="mt-2 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <label htmlFor="power-sos" className="font-medium text-gray-800">{translations.profile.powerButtonSos}</label>
                                <p className="text-sm text-gray-500">{translations.profile.powerButtonSosDesc}</p>
                            </div>
                            <ToggleSwitch id="power-sos" checked={false} onChange={() => {}} disabled={true} />
                        </div>
                        <p className="text-xs text-orange-500 mt-2">{translations.profile.featureComingSoon}</p>
                    </div>
                </div>

                {/* Navigation Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{translations.profile.navigationSettings}</h3>
                    <div className="mt-2 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <label htmlFor="voice-nav" className="font-medium text-gray-800">{translations.profile.voiceNav}</label>
                                <p className="text-sm text-gray-500">{translations.profile.voiceNavDesc}</p>
                            </div>
                            <ToggleSwitch id="voice-nav" checked={false} onChange={() => {}} disabled={true} />
                        </div>
                         <p className="text-xs text-orange-500 mt-2">{translations.profile.featureComingSoon}</p>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;