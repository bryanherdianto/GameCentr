package routes

import (
	"netgames-go-server/controllers"

	"github.com/gin-gonic/gin"
)

func SetupGameScoreRoutes(router *gin.Engine) {
    gameGroup := router.Group("/game")
    {
        gameGroup.GET("/leaderboard", controllers.GetGlobalLeaderboard)
        gameGroup.GET("/:game/score", controllers.GetScoresByGame)
        gameGroup.POST("/:game/score", controllers.PostScore)
        gameGroup.POST("/:game/score/:scoreId/comment", controllers.AddCommentToScore)
		// Tambahkan endpoint lain jika perlu, misal leaderboard per game, dsb
	}
}
