package controllers

import (
	"context"
	"net/http"
	"netgames-go-server/db"
	"netgames-go-server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetScoresByGame returns all scores for a specific game
func GetScoresByGame(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	gameName := c.Param("game")
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "value", Value: -1}})

	cursor, err := db.ScoreColl.Find(ctx, bson.M{"game": gameName}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var scores []models.Score
	if err := cursor.All(ctx, &scores); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	var scoresWithDetails []models.ScoreWithUserDetails
	for _, score := range scores {
		var owner models.User
		err := db.UserColl.FindOne(ctx, bson.M{"_id": score.Owner}).Decode(&owner)
		if err != nil {
			continue
		}
		scoresWithDetails = append(scoresWithDetails, models.ScoreWithUserDetails{
			ID:        score.ID,
			Owner:     owner.ToResponse(),
			Value:     score.Value,
			Text:      score.Text,
			Comments:  nil,
			CreatedAt: score.CreatedAt,
			UpdatedAt: score.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully retrieved scores for game",
		"data":    scoresWithDetails,
	})
}

// GetGlobalLeaderboard returns top scores from all games
func GetGlobalLeaderboard(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "value", Value: -1}})
	findOptions.SetLimit(20)

	cursor, err := db.ScoreColl.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var scores []models.Score
	if err := cursor.All(ctx, &scores); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	var scoresWithDetails []models.ScoreWithUserDetails
	for _, score := range scores {
		var owner models.User
		err := db.UserColl.FindOne(ctx, bson.M{"_id": score.Owner}).Decode(&owner)
		if err != nil {
			continue
		}
		scoresWithDetails = append(scoresWithDetails, models.ScoreWithUserDetails{
			ID:        score.ID,
			Owner:     owner.ToResponse(),
			Value:     score.Value,
			Text:      score.Text,
			Comments:  nil,
			CreatedAt: score.CreatedAt,
			UpdatedAt: score.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully retrieved global leaderboard",
		"data":    scoresWithDetails,
	})
}
