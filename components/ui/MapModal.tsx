import React from 'react';
import { Modal } from './Modal';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  locationCoords?: { lat: number; lng: number };
}

const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

/**
 * A modal for displaying a location on the event map.
 */
export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, locationName, locationCoords }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Location: ${locationName}`}>
      <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center">
        <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover"/>
        {locationCoords ? (
          <div className="absolute" style={{ top: `${locationCoords.lat}%`, left: `${locationCoords.lng}%`, transform: 'translate(-50%, -100%)' }}>
            <div className="relative flex flex-col items-center">
              <LocationPinIcon />
              <div className="bg-white text-sm px-2 py-1 rounded-full shadow-lg mt-1 whitespace-nowrap">{locationName}</div>
            </div>
          </div>
        ) : (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-white bg-red-500 p-3 rounded-lg">Location coordinates not available for this report.</p>
            </div>
        )}
      </div>
    </Modal>
  );
};