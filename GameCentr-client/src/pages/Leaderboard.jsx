import { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getGameLeaderboard, getAllGameTypes, getGlobalLeaderboard } from '../actions/Score.action';

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [gameTypes, setGameTypes] = useState([]);
    const [selectedGame, setSelectedGame] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [stats, setStats] = useState(null);
    const [sortField, setSortField] = useState("score");
    const [sortDirection, setSortDirection] = useState("desc");
    const [timeFrame, setTimeFrame] = useState("all");
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("game"); // "game" or "global"
    
    // Score filtering
    const [minScore, setMinScore] = useState("");
    const [maxScore, setMaxScore] = useState("");
    const [useMinScore, setUseMinScore] = useState(false);
    const [useMaxScore, setUseMaxScore] = useState(false);

    // Fetch game types on component mount
    useEffect(() => {
        getAllGameTypes()
            .then((response) => {
                if (response.data) {
                    setGameTypes(response.data);
                    if (response.data.length > 0) {
                        setSelectedGame(response.data[0].game_code);
                    }
                } else {
                    console.error("Failed to get game types");
                }
            })
            .catch((error) => {
                console.error("Error fetching game types:", error.message);
            });
    }, []);

    // Fetch leaderboard data when selected game or view mode changes
    useEffect(() => {
        if (viewMode === "game" && selectedGame) {
            fetchLeaderboardData();
        } else if (viewMode === "global") {
            fetchGlobalLeaderboardData();
        }
    }, [selectedGame, timeFrame, limit, viewMode]);

    const fetchLeaderboardData = () => {
        setLoading(true);
        getGameLeaderboard(selectedGame, { timeFrame, limit })
            .then((response) => {
                if (response.data) {
                    setLeaderboardData(response.data);
                    setGameInfo(response.gameInfo);
                    setStats(response.stats);
                } else {
                    console.error("Failed to get leaderboard data");
                    setLeaderboardData([]);
                    setGameInfo(null);
                    setStats(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching leaderboard:", error.message);
                setLoading(false);
            });
    };

    const fetchGlobalLeaderboardData = () => {
        setLoading(true);
        getGlobalLeaderboard({ limit })
            .then((response) => {
                if (response.data) {
                    setLeaderboardData(response.data);
                    setGameInfo(null);
                    setStats(null);
                } else {
                    console.error("Failed to get global leaderboard data");
                    setLeaderboardData([]);
                    setGameInfo(null);
                    setStats(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching global leaderboard:", error.message);
                setLoading(false);
            });
    };

    const handleGameChange = (e) => {
        setSelectedGame(e.target.value);
    };

    const handleTimeFrameChange = (e) => {
        setTimeFrame(e.target.value);
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    // Filter the leaderboard data based on score filters
    const filteredData = leaderboardData.filter(entry => {
        let passesFilter = true;
        
        if (useMinScore && minScore !== "") {
            passesFilter = passesFilter && entry.score >= parseInt(minScore);
        }
        
        if (useMaxScore && maxScore !== "") {
            passesFilter = passesFilter && entry.score <= parseInt(maxScore);
        }
        
        return passesFilter;
    });

    // Sort the filtered leaderboard data
    const sortedData = [...filteredData].sort((a, b) => {
        let valueA, valueB;
        
        if (sortField === "user") {
            valueA = a.user.username.toLowerCase();
            valueB = b.user.username.toLowerCase();
            return sortDirection === "asc" 
                ? valueA.localeCompare(valueB) 
                : valueB.localeCompare(valueA);
        } else if (sortField === "score") {
            valueA = a.score;
            valueB = b.score;
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        } else if (sortField === "rank") {
            valueA = a.rank;
            valueB = b.rank;
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
        return 0;
    });

    // Get the selected game type
    const selectedGameType = gameTypes.find(game => game.game_code === selectedGame);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-center text-white mb-8">Game Leaderboards</h1>

                    {/* View Mode Selector */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setViewMode("game")}
                                className={`px-4 py-2 rounded-md ${
                                    viewMode === "game"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Game Leaderboards
                            </button>
                            <button
                                onClick={() => setViewMode("global")}
                                className={`px-4 py-2 rounded-md ${
                                    viewMode === "global"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Global Leaderboard
                            </button>
                        </div>

                        {/* Score Filtering */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Score Filter</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Min Score Filter */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="useMinScore"
                                        checked={useMinScore}
                                        onChange={(e) => setUseMinScore(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="useMinScore" className="text-sm text-gray-700">
                                        Score Greater Than
                                    </label>
                                    <input
                                        type="number"
                                        value={minScore}
                                        onChange={(e) => setMinScore(e.target.value)}
                                        disabled={!useMinScore}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                                        placeholder="Min score"
                                    />
                                </div>

                                {/* Max Score Filter */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="useMaxScore"
                                        checked={useMaxScore}
                                        onChange={(e) => setUseMaxScore(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="useMaxScore" className="text-sm text-gray-700">
                                        Score Less Than
                                    </label>
                                    <input
                                        type="number"
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(e.target.value)}
                                        disabled={!useMaxScore}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                                        placeholder="Max score"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Controls */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Game Type Selector - Only show in game mode */}
                            {viewMode === "game" && (
                                <div>
                                    <label htmlFor="gameType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Game Type
                                    </label>
                                    <select
                                        id="gameType"
                                        value={selectedGame}
                                        onChange={handleGameChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        {gameTypes.map((game) => (
                                            <option key={game.game_code} value={game.game_code}>
                                                {game.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Time Frame Selector - Only show in game mode */}
                            {viewMode === "game" && (
                                <div>
                                    <label htmlFor="timeFrame" className="block text-sm font-medium text-gray-700 mb-1">
                                        Time Frame
                                    </label>
                                    <select
                                        id="timeFrame"
                                        value={timeFrame}
                                        onChange={handleTimeFrameChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="daily">Today</option>
                                        <option value="weekly">This Week</option>
                                        <option value="monthly">This Month</option>
                                    </select>
                                </div>
                            )}

                            {/* Empty div for spacing in global mode */}
                            {viewMode === "global" && <div></div>}
                            {viewMode === "global" && <div></div>}

                            {/* Limit Selector */}
                            <div>
                                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                                    Show Top
                                </label>
                                <select
                                    id="limit"
                                    value={limit}
                                    onChange={handleLimitChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            {/* Refresh Button */}
                            <div className="flex items-end">
                                <button
                                    onClick={viewMode === "game" ? fetchLeaderboardData : fetchGlobalLeaderboardData}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? "Loading..." : "Refresh"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Global Leaderboard Title */}
                    {viewMode === "global" && (
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h2 className="text-xl font-bold text-indigo-700 mb-2">Global Leaderboard</h2>
                            <p className="text-gray-600">
                                Top players across all games. Scores are normalized based on each game's scoring system.
                            </p>
                        </div>
                    )}

                    {/* Game Info and Stats */}
                    {viewMode === "game" && gameInfo && (
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-xl font-bold text-indigo-700 mb-2">{gameInfo.name}</h2>
                                    <p className="text-gray-600 mb-2">{gameInfo.description}</p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Scoring Type:</span> {gameInfo.scoringType}
                                        {gameInfo.maxScore && ` (Max: ${gameInfo.maxScore})`}
                                    </p>
                                </div>
                                {stats && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Total Plays</p>
                                            <p className="text-2xl font-bold text-indigo-700">{stats.totalPlays}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Average Score</p>
                                            <p className="text-2xl font-bold text-indigo-700">
                                                {Math.round(stats.averageScore * 10) / 10}
                                            </p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Highest Score</p>
                                            <p className="text-2xl font-bold text-indigo-700">{stats.highestScore}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">Lowest Score</p>
                                            <p className="text-2xl font-bold text-indigo-700">{stats.lowestScore}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filter Status */}
                    {(useMinScore || useMaxScore) && (
                        <div className="bg-blue-50 rounded-xl shadow-md p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-blue-700">
                                        Showing {sortedData.length} of {leaderboardData.length} scores
                                        {leaderboardData.length - sortedData.length > 0 && ` (${leaderboardData.length - sortedData.length} filtered out)`}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setUseMinScore(false);
                                        setUseMaxScore(false);
                                        setMinScore("");
                                        setMaxScore("");
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Leaderboard Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("rank")}
                                        >
                                            <div className="flex items-center">
                                                Rank
                                                {sortField === "rank" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("user")}
                                        >
                                            <div className="flex items-center">
                                                Player
                                                {sortField === "user" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("score")}
                                        >
                                            <div className="flex items-center">
                                                Score
                                                {sortField === "score" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : sortedData.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No scores to display yet. Play the game to be the first!
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedData.map((entry, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {entry.rank}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {entry.user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {entry.score}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(entry.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Scoring Type Info - Only show in game mode */}
                    {viewMode === "game" && selectedGameType && (
                        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">About {selectedGameType.name} Scoring</h3>
                            <p className="text-gray-600 mb-4">
                                {getScoringTypeDescription(selectedGameType.scoring_type)}
                            </p>
                            {selectedGameType.max_score && (
                                <p className="text-sm text-gray-500">
                                    Maximum possible score: <span className="font-medium">{selectedGameType.max_score}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

// Helper function to get scoring type descriptions
function getScoringTypeDescription(scoringType) {
    switch (scoringType) {
        case "points":
            return "Points are awarded based on correct answers or successful actions in the game. Higher points indicate better performance.";
        case "rounds":
            return "Scores represent the number of rounds or levels completed. The more rounds completed, the higher the score.";
        case "binary":
            return "This game uses a win/lose scoring system. A score of 100 indicates a win, while 0 indicates a loss.";
        case "sentences":
            return "Scores represent the number of sentences successfully completed. More sentences completed means a higher score.";
        case "bounces":
            return "Scores are based on the number of successful ball bounces. More bounces indicate longer gameplay and higher skill.";
        default:
            return "Scores represent your performance in the game. Higher scores indicate better performance.";
    }
}
