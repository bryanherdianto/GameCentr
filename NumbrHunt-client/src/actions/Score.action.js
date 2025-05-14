import axios from "axios";

const backend_URI = window.location.hostname === 'localhost'
    ? "http://localhost:8080"
    : "https://sbd-numbrhunt.jpmd53.easypanel.host";

const baseApiResponse = (data, isSuccess) => {
    return {
        success: isSuccess,
        data: data || null,
    };
};

// post score
export const createScorePost = async (input) => {
    try {
        const response = await axios.post(
            `${backend_URI}/game/${input.game}/score`, input
        );

        console.log("Response from Backend");
        console.log(response.data);
        return baseApiResponse(response.data.data, true);
    } catch (error) {
        console.error(error);
        return baseApiResponse(null, false);
    }
};

// get all scores
export const getAllScores = async () => {
    try {
        const response = await axios.get(
            `${backend_URI}/score`
        );

        console.log("Response from Backend");
        console.log(response.data);
        return baseApiResponse(response.data.data, true);
    } catch (error) {
        console.error(error);
        return baseApiResponse(null, false);
    }
};

// get all scores for a game
export const getScoresByGame = async (game) => {
    try {
        const response = await axios.get(
            `${backend_URI}/game/${game}/score`
        );

        console.log("Response from Backend");
        console.log(response.data);
        return baseApiResponse(response.data.data, true);
    } catch (error) {
        console.error(error);
        return baseApiResponse(null, false);
    }
};

// add comment to score post
export const addComment = async (input) => {
    try {
        const response = await axios.post(
            `${backend_URI}/game/${game}/score/${scoreId}/comment`,
            { author, text }
        );

        console.log("Response from Backend");
        console.log(response.data);
        return baseApiResponse(response.data.data, true);
    } catch (error) {
        console.error(error);
        return baseApiResponse(null, false);
    }
};

// get global leaderboard
export const getGlobalLeaderboard = async () => {
    try {
        const response = await axios.get(
            `${backend_URI}/game/leaderboard`
        );

        console.log("Response from Backend");
        console.log(response.data);
        return baseApiResponse(response.data.data, true);
    } catch (error) {
        console.error(error);
        return baseApiResponse(null, false);
    }
};