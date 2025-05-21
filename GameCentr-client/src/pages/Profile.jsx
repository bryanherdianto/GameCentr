import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserAchievements } from '../actions/Achievement.actions';

const Profile = () => {
  const [cookies] = useCookies(['user_id', 'username']);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserAchievements(cookies.user_id);
        setUserProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };

    if (cookies.user_id) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [cookies.user_id, navigate]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get background color based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 border-green-300';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300';
      case 'hard':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : userProfile ? (
          <div>
            {/* User Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{userProfile.user.username}'s Profile</h1>
              <div className="text-gray-600">
                <p>Member since: {formatDate(userProfile.user.createdAt)}</p>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="bg-blue-100 rounded-lg p-4">
                      <p className="text-blue-800 font-medium">Total Achievements</p>
                      <p className="text-2xl font-bold">{userProfile.stats.totalAchievements || 0}</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-4">
                      <p className="text-purple-800 font-medium">Games Played</p>
                      <p className="text-2xl font-bold">{userProfile.stats.totalGamesPlayed || 0}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4">
                      <p className="text-green-800 font-medium">Highest Score</p>
                      <p className="text-2xl font-bold">{userProfile.stats.highestScore || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Achievements</h2>
              
              {userProfile.achievements.length === 0 ? (
                <p className="text-gray-600">No achievements yet. Start playing games to earn achievements!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfile.achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                        achievement.isUnlocked 
                          ? `${getDifficultyColor(achievement.difficulty)} hover:shadow-md` 
                          : 'bg-gray-100 border-gray-300 opacity-70'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="text-4xl mr-4">
                          {achievement.isUnlocked ? achievement.icon : '❓'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {achievement.gameName} • {achievement.difficulty.charAt(0).toUpperCase() + achievement.difficulty.slice(1)}
                          </p>
                          <p className="text-sm mb-2">{achievement.description}</p>
                          {achievement.isUnlocked && (
                            <p className="text-xs text-gray-500">
                              Unlocked: {formatDate(achievement.awardedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">No profile data found.</strong>
            <span className="block sm:inline"> Please log in again.</span>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
