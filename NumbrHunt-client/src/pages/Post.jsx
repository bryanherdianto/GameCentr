import { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllScores } from '../actions/Score.action';
import ScoreCard from '../components/ScoreCard';

export default function Post() {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        getAllScores()
            .then((response) => {
                if (response.data != null) {
                    setScores(response.data);
                } else {
                    alert("Failed to get all scores!");
                }
            })
            .catch((error) => {
                console.error("Error fetching scores:", error.message);
            });
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-center text-white mb-10">Leaderboard</h1>

                    <div className="space-y-6">
                        {scores.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                                <p className="text-gray-600">No scores to display yet. Play the game to be the first!</p>
                            </div>
                        ) : (
                            scores.map((score, index) => (
                                <div key={index} className="transition-all duration-300 hover:transform hover:scale-102 hover:shadow-xl">
                                    <ScoreCard
                                        score_id={score._id}
                                        username={score.owner.username}
                                        score={score.value}
                                        text={score.text}
                                        comments={score.comments}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}