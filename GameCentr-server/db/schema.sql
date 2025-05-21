-- MongoDB Schema for GameCentr Application
-- Note: This is a SQL-like representation of MongoDB collections for documentation purposes

-- Users Collection
CREATE TABLE users (
    _id ObjectId PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    scores ARRAY[ObjectId], -- References to score documents
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);

-- Game Types Collection
CREATE TABLE game_types (
    _id ObjectId PRIMARY KEY,
    game_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    scoring_type VARCHAR(50) NOT NULL, -- points, rounds, binary, sentences, bounces, etc.
    max_score INTEGER, -- Optional maximum score for the game
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);

-- Game Scores Collection
CREATE TABLE game_scores (
    _id ObjectId PRIMARY KEY,
    owner ObjectId NOT NULL REFERENCES users(_id),
    game VARCHAR(50) NOT NULL REFERENCES game_types(game_code),
    value INTEGER NOT NULL, -- The actual score value
    text VARCHAR(255), -- Optional text description
    metadata JSONB, -- Game-specific data (flexible schema)
    comments ARRAY[ObjectId], -- References to comment documents
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);

-- Comments Collection
CREATE TABLE comments (
    _id ObjectId PRIMARY KEY,
    score ObjectId NOT NULL REFERENCES game_scores(_id),
    author ObjectId NOT NULL REFERENCES users(_id),
    text TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);

-- Leaderboards Collection (for caching/pre-computing leaderboards)
CREATE TABLE leaderboards (
    _id ObjectId PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL REFERENCES game_types(game_code),
    timeframe VARCHAR(20) NOT NULL, -- all, daily, weekly, monthly
    entries ARRAY[
        {
            user_id: ObjectId,
            username: VARCHAR(50),
            score: INTEGER,
            rank: INTEGER
        }
    ],
    last_updated TIMESTAMP NOT NULL
);

-- Achievements Collection
CREATE TABLE achievements (
    _id ObjectId PRIMARY KEY,
    game_code VARCHAR(50) NOT NULL REFERENCES game_types(game_code),
    code VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL, -- Emoji or icon identifier
    difficulty VARCHAR(20) NOT NULL, -- easy, medium, hard
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE, -- Easter egg achievements
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    UNIQUE(game_code, code)
);

-- User Achievements Collection
CREATE TABLE user_achievements (
    _id ObjectId PRIMARY KEY,
    user_id ObjectId NOT NULL REFERENCES users(_id),
    achievement_id ObjectId NOT NULL REFERENCES achievements(_id),
    game_code VARCHAR(50) NOT NULL REFERENCES game_types(game_code),
    awarded_at TIMESTAMP NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Indexes
-- Users Collection
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Game Types Collection
CREATE UNIQUE INDEX idx_game_types_game_code ON game_types(game_code);

-- Game Scores Collection
CREATE INDEX idx_game_scores_owner ON game_scores(owner);
CREATE INDEX idx_game_scores_game ON game_scores(game);
CREATE INDEX idx_game_scores_value_desc ON game_scores(value DESC); -- For leaderboards
CREATE INDEX idx_game_scores_game_owner ON game_scores(game, owner); -- For user game scores
CREATE INDEX idx_game_scores_created_at ON game_scores(createdAt); -- For time-based filtering

-- Comments Collection
CREATE INDEX idx_comments_score ON comments(score);
CREATE INDEX idx_comments_author ON comments(author);

-- Leaderboards Collection
CREATE UNIQUE INDEX idx_leaderboards_game_timeframe ON leaderboards(game_type, timeframe);

-- Achievements Collection
CREATE UNIQUE INDEX idx_achievements_game_code ON achievements(game_code, code);
CREATE INDEX idx_achievements_difficulty ON achievements(difficulty);
CREATE INDEX idx_achievements_is_hidden ON achievements(is_hidden);

-- User Achievements Collection
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_game_code ON user_achievements(game_code);
CREATE UNIQUE INDEX idx_user_achievements_user_achievement ON user_achievements(user_id, achievement_id);

-- Game-Specific Metadata Examples
-- These are examples of what might be stored in the metadata field for different games

-- ColorGuess
-- {
--   "totalGuesses": 10,
--   "correctGuesses": 8,
--   "timeSpent": 45.5, -- seconds
--   "difficulty": "hard"
-- }

-- GuessGame (Number Guess)
-- {
--   "target": 42,
--   "attempts": 5,
--   "range": {"min": 1, "max": 100}
-- }

-- HangmanGame
-- {
--   "word": "PROGRAMMING",
--   "guessedLetters": ["P", "R", "O", "G", "A", "M", "I", "N"],
--   "wrongGuesses": 2,
--   "timeSpent": 120.5 -- seconds
-- }

-- MemoryMatch
-- {
--   "boardSize": "4x4",
--   "moves": 24,
--   "timeSpent": 65.3, -- seconds
--   "matchedPairs": 8
-- }

-- PatternRepeater
-- {
--   "patternLength": 8,
--   "maxPatternReached": 12,
--   "timePerPattern": 2.5 -- seconds
-- }

-- PongGame
-- {
--   "bounces": 42,
--   "timeSpent": 180.2, -- seconds
--   "difficulty": "medium"
-- }

-- QuickMathChallenge
-- {
--   "correctAnswers": 12,
--   "wrongAnswers": 3,
--   "timeSpent": 60.0, -- seconds
--   "difficulty": "medium",
--   "operations": ["addition", "subtraction", "multiplication"]
-- }

-- SimonSays
-- {
--   "roundsCompleted": 9,
--   "maxSequenceLength": 9,
--   "timeSpent": 120.5 -- seconds
-- }

-- TypingGame
-- {
--   "sentencesCompleted": 5,
--   "accuracy": 95.5, -- percentage
--   "wpm": 65, -- words per minute
--   "timeSpent": 180.0 -- seconds
-- }

-- WhackAMole
-- {
--   "molesWhacked": 25,
--   "missedClicks": 8,
--   "timeSpent": 60.0, -- seconds
--   "difficulty": "hard"
-- }

-- Achievement Progress Examples
-- These are examples of what might be stored in the progress field for achievement checks

-- ColorGuess Achievement Progress
-- {
--   "correctAnswers": 20,
--   "mistakes": 0,
--   "timeSpent": 25.5, -- seconds
--   "completed": true,
--   "playCount": 50
-- }

-- GuessGame Achievement Progress
-- {
--   "guessCount": 1,
--   "correct": true,
--   "distance": 2,
--   "target": 42
-- }

-- HangmanGame Achievement Progress
-- {
--   "incorrectGuesses": 0,
--   "solved": true,
--   "remainingGuesses": 1,
--   "allVowelsGuessed": true,
--   "winCount": 10
-- }

-- MemoryMatch Achievement Progress
-- {
--   "incorrectMatches": 0,
--   "completed": true,
--   "timeSpent": 25.5, -- seconds
--   "streak": 5
-- }

-- PatternRepeater Achievement Progress
-- {
--   "level": 20,
--   "perfectTiming": true,
--   "playCount": 20
-- }

-- PongGame Achievement Progress
-- {
--   "score": 50,
--   "rallyLength": 20,
--   "comeback": true,
--   "deficitOvercome": 5
-- }

-- QuickMath Achievement Progress
-- {
--   "streak": 15,
--   "questionsAnswered": 10,
--   "timeSpent": 18.5, -- seconds
--   "completed": true,
--   "playCount": 30
-- }

-- SimonSays Achievement Progress
-- {
--   "level": 15,
--   "streak": 5,
--   "perfectTiming": true
-- }

-- TypingGame Achievement Progress
-- {
--   "wpm": 80,
--   "errors": 0,
--   "completed": true,
--   "totalWords": 1000
-- }

-- WhackAMole Achievement Progress
-- {
--   "molesWhacked": 50,
--   "streak": 10,
--   "frenzy": true
-- }

-- Global Achievement Progress
-- {
--   "gamesPlayed": {
--     "colorguess": true,
--     "guess": true,
--     "hangman": true,
--     "memorymatch": true,
--     "patternrepeater": true,
--     "pong": true,
--     "quickmath": true,
--     "simonsays": true,
--     "typing": true,
--     "whackamole": true
--   },
--   "achievementCount": 20
-- }
