import React, { useState, useEffect } from 'react';
import { Bell, User, MapPin, Shield, Settings, AlertTriangle, Menu, X, ChevronRight, BookText } from 'lucide-react';

const AbhayaApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Priya Sharma', relation: 'Friend', phone: '999-123-4567', sharingLocation: false },
    { id: 2, name: 'Maa', relation: 'Family', phone: '999-987-6543', sharingLocation: true },
    { id: 3, name: 'Police', relation: 'Emergency Service', phone: '100', sharingLocation: false }
  ]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [locationAddress, setLocationAddress] = useState('Loading address...');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  
  // Simulate Google Maps API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
      setLocationAddress('123 Connaught Place, New Delhi');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle emergency mode countdown
  useEffect(() => {
    if (emergencyMode && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emergencyMode, countdown]);

  // Simulate location updates
  useEffect(() => {
    if (mapLoaded) {
      const locationInterval = setInterval(() => {
        setCurrentLocation(prev => ({
          lat: prev.lat + (Math.random() * 0.0005 - 0.00025),
          lng: prev.lng + (Math.random() * 0.0005 - 0.00025)
        }));
      }, 5000);
      
      return () => clearInterval(locationInterval);
    }
  }, [mapLoaded]);

  const triggerEmergency = () => {
    setEmergencyMode(true);
  };

  const cancelEmergency = () => {
    setEmergencyMode(false);
    setCountdown(5);
  };

  const toggleLocationSharing = (contactId) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, sharingLocation: !contact.sharingLocation } 
        : contact
    ));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
      setContacts([...contacts, { 
        id: newId, 
        name: newContact.name, 
        relation: newContact.relation || 'Other', 
        phone: newContact.phone, 
        sharingLocation: false 
      }]);
      setNewContact({ name: '', relation: '', phone: '' });
      setShowAddContact(false);
    }
  };

  // Simple map component
  const MapDisplay = ({ height = "h-40", includeRoute = false }) => (
    <div className={`bg-blue-100 rounded ${height} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center">
        {/* Simulated map grid */}
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
            {Array(64).fill(0).map((_, i) => (
              <div key={i} className="border border-blue-300"></div>
            ))}
          </div>
          
          {/* Roads */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-300"></div>
            {includeRoute && (
              <div className="absolute top-1/4 left-1/3 bottom-0 w-2 bg-blue-400"></div>
            )}
            {includeRoute && (
              <div className="absolute bottom-0 left-1/3 right-0 h-2 bg-blue-400"></div>
            )}
          </div>
          
          {/* Current location marker */}
          <div className="absolute" style={{ top: '40%', left: '40%' }}>
            <div className="bg-pink-600 rounded-full w-4 h-4 animate-pulse"></div>
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-pink-300 rounded-full opacity-30 animate-ping"></div>
          </div>
          
          {includeRoute && (
            <div className="absolute" style={{ top: '75%', left: '75%' }}>
              <div className="bg-green-600 rounded-full w-4 h-4"></div>
            </div>
          )}
        </div>
        
        <div className="bg-white bg-opacity-70 px-2 py-1 rounded absolute top-1 left-1 text-xs">
          Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );

  // Add Contact Form
  const AddContactForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
          <span>Add New Contact</span>
          <button onClick={() => setShowAddContact(false)}>
            <X className="w-5 h-5" />
          </button>
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
          <select 
            className="w-full p-2 border rounded"
            value={newContact.relation}
            onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
          >
            <option value="">Select Relation</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Emergency Service">Emergency Service</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
          />
        </div>
        <div className="flex justify-end">
          <button 
            className="bg-gray-300 text-gray-800 mr-2 py-2 px-4 rounded"
            onClick={() => setShowAddContact(false)}
          >
            Cancel
          </button>
          <button 
            className="bg-pink-600 text-white py-2 px-4 rounded"
            onClick={handleAddContact}
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );

  // Sidebar Menu
  const SideMenu = () => (
    <div className={`fixed inset-0 z-50 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={toggleMenu}></div>
      <div className="bg-white h-full w-3/4 max-w-xs relative z-10 overflow-y-auto shadow-lg">
        <div className="bg-pink-600 p-4 text-white flex items-center justify-between">
          <h2 className="text-xl font-bold">Abhaya Menu</h2>
          <button onClick={toggleMenu}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="w-16 h-16 bg-pink-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            <User className="w-8 h-8 text-pink-600" />
          </div>
          <p className="text-center font-bold">Aanya Patel</p>
          <p className="text-center text-gray-600 text-sm">aanya.patel@example.com</p>
        </div>
        
        <nav className="p-2">
          {[
            { name: 'Profile', icon: <User className="w-5 h-5" /> },
            { name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
            { name: 'Emergency Contacts', icon: <User className="w-5 h-5" /> },
            { name: 'Safety Tips', icon: <Shield className="w-5 h-5" /> },
            { name: 'Help & Support', icon: <MapPin className="w-5 h-5" /> },
            { name: 'About Abhaya', icon: <AlertTriangle className="w-5 h-5" /> },
            { name: 'Settings', icon: <Settings className="w-5 h-5" /> }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-pink-50 rounded cursor-pointer">
              <div className="flex items-center">
                <span className="text-pink-600 mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="flex items-center text-pink-600 font-medium">
            <span className="mr-2">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 border border-gray-200 rounded-lg overflow-hidden max-w-md mx-auto relative">
      {/* Header - Magenta pink */}
      <header className="bg-pink-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="mr-3">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Abhaya</h1>
        </div>
        <User className="w-6 h-6 cursor-pointer" />
      </header>

      {/* Sidebar Menu */}
      <SideMenu />

      {/* Add Contact Form Modal */}
      {showAddContact && <AddContactForm />}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {emergencyMode ? (
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-red-700 text-lg font-bold">EMERGENCY MODE ACTIVE</h2>
              <button 
                className="bg-white text-red-700 px-3 py-1 rounded-full text-sm font-bold cursor-pointer"
                onClick={cancelEmergency}
              >
                CANCEL ({countdown})
              </button>
            </div>
            <p className="mt-2 text-red-700">Contacting your emergency list...</p>
            <p className="mt-1 text-red-700">Current location: {locationAddress}</p>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-white p-2 rounded flex justify-between items-center">
                  <div>
                    <p className="font-bold">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <div>
                <div className="bg-pink-50 p-4 rounded-lg mb-4 flex justify-center">
                  <button 
                    className="bg-red-600 text-white font-bold text-lg flex items-center justify-center cursor-pointer rounded-full w-36 h-36 shadow-lg hover:bg-red-700 transition-colors"
                    onClick={triggerEmergency}
                  >
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="w-12 h-12 mb-2" />
                      <span>SOS ALERT</span>
                    </div>
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h2 className="font-bold mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-1 text-pink-600" />
                    Live Location
                  </h2>
                  {mapLoaded ? (
                    <MapDisplay />
                  ) : (
                    <div className="bg-gray-200 h-40 rounded flex items-center justify-center mb-2">
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{locationAddress}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold mb-2 flex items-center">
                    <Bell className="w-5 h-5 mr-1 text-pink-600" />
                    Location Sharing Status
                  </h2>
                  <div className="text-sm">
                    {contacts.filter(c => c.sharingLocation).length > 0 ? (
                      contacts.filter(c => c.sharingLocation).map(contact => (
                        <div key={contact.id} className="py-1 flex justify-between items-center">
                          <span>{contact.name}</span>
                          <span className="text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                            Active
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Not sharing with any contacts</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h2 className="text-lg font-bold mb-4">My Trusted Contacts</h2>
                <div className="bg-white rounded-lg shadow p-4">
                  {contacts.map(contact => (
                    <div key={contact.id} className="py-3 border-b last:border-0">
                      <div className="flex justify-between mb-1">
                        <div>
                          <p className="font-bold">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.relation} • {contact.phone}</p>
                        </div>
                        <div className={`text-sm ${contact.sharingLocation ? 'text-green-600' : 'text-gray-500'}`}>
                          {contact.sharingLocation ? 'Sharing' : 'Not sharing'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <button 
                          className={`text-sm py-1 px-3 rounded-full cursor-pointer w-full border ${
                            contact.sharingLocation 
                              ? 'bg-pink-600 text-white border-pink-600' 
                              : 'bg-white text-pink-600 border-pink-600'
                          }`}
                          onClick={() => toggleLocationSharing(contact.id)}
                        >
                          {contact.sharingLocation ? 'Stop Sharing Location' : 'Share My Location'}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="mt-4 bg-pink-600 text-white py-2 px-4 rounded-lg w-full cursor-pointer"
                    onClick={() => setShowAddContact(true)}
                  >
                    Add New Contact
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Safe Routes</h2>
                <div className="bg-white rounded-lg shadow p-4">
                  {mapLoaded ? (
                    <MapDisplay height="h-48" includeRoute={true} />
                  ) : (
                    <div className="bg-gray-200 h-48 rounded flex items-center justify-center mb-4">
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  )}
                  <div className="mb-4 mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
                    <input type="text" className="w-full p-2 border rounded" value="Current Location" readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Where are you going?" />
                  </div>
                  <button className="bg-pink-600 text-white py-2 px-4 rounded-lg w-full cursor-pointer">
                    Find Safe Route
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Safety Resources</h2>
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-bold text-pink-600 mb-2">Emergency Numbers</h3>
                  <ul className="text-sm">
                    <li className="py-2 border-b">Police: 100</li>
                    <li className="py-2 border-b">Women's Helpline: 1098</li>
                    <li className="py-2 border-b">Medical Emergency: 108</li>
                    <li className="py-2 border-b">National Emergency Number: 112</li>
                    <li className="py-2">Fire: 101</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-pink-600 mb-2">Self-Defense Tips</h3>
                  <ul className="text-sm list-disc pl-5">
                    <li className="py-1">Be aware of your surroundings</li>
                    <li className="py-1">Trust your instincts</li>
                    <li className="py-1">Stay in well-lit areas at night</li>
                    <li className="py-1">Keep your phone charged</li>
                    <li className="py-1">Share your location with trusted contacts</li>
                    <li className="py-1">Avoid isolated areas, especially at night</li>
                    <li className="py-1">Carry pepper spray for safety</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Settings</h2>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="py-3 border-b flex items-center justify-between">
                    <div>
                      <p className="font-bold">Location Accuracy</p>
                      <p className="text-sm text-gray-600">High precision location updates</p>
                    </div>
                    <div className="relative">
                      <div className="block bg-pink-600 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>
                  <div className="py-3 border-b flex items-center justify-between">
                    <div>
                      <p className="font-bold">Background Location</p>
                      <p className="text-sm text-gray-600">Share location when app is closed</p>
                    </div>
                    <div className="relative">
                      <div className="block bg-pink-600 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>
                  <div className="py-3 border-b flex items-center justify-between">
                    <div>
                      <p className="font-bold">Sound Alerts</p>
                      <p className="text-sm text-gray-600">Play sound during emergency</p>
                    </div>
                    <div className="relative">
                      <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Automatic Recording</p>
                      <p className="text-sm text-gray-600">Record audio during emergency</p>
                    </div>
                    <div className="relative">
                      <div className="block bg-pink-600 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-7 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation - Resized */}
      <nav className="bg-white border-t fixed bottom-0 w-full shadow-lg max-w-md">
        <div className="flex justify-around">
          <button 
            className={`py-3 flex flex-col items-center ${activeTab === 'home' ? 'text-pink-600' : 'text-gray-500'} cursor-pointer w-1/5`}
            onClick={() => setActiveTab('home')}
          >
            <Shield className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className={`py-3 flex flex-col items-center ${activeTab === 'contacts' ? 'text-pink-600' : 'text-gray-500'} cursor-pointer w-1/5`}
            onClick={() => setActiveTab('contacts')}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Contacts</span>
          </button>
          <button 
            className={`py-3 flex flex-col items-center ${activeTab === 'location' ? 'text-pink-600' : 'text-gray-500'} cursor-pointer w-1/5`}
            onClick={() => setActiveTab('location')}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs mt-1">Routes</span>
          </button>
          <button 
            className={`py-3 flex flex-col items-center ${activeTab === 'resources' ? 'text-pink-600' : 'text-gray-500'} cursor-pointer w-1/5`}
            onClick={() => setActiveTab('resources')}
          >
            <BookText className="w-6 h-6" />
            <span className="text-xs mt-1">Resources</span>
          </button>
          <button 
            className={`py-3 flex flex-col items-center ${activeTab === 'settings' ? 'text-pink-600' : 'text-gray-500'} cursor-pointer w-1/5`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AbhayaApp;