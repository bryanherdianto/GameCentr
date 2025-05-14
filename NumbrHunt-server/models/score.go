package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Score struct {
	ID        primitive.ObjectID   `bson:"_id,omitempty" json:"_id,omitempty"`
	Owner     primitive.ObjectID   `bson:"owner" json:"owner" binding:"required"`
	Game      string               `bson:"game" json:"game" binding:"required"` // Tambahan
	Value     int                  `bson:"value" json:"value" binding:"required"`
	Text      string               `bson:"text" json:"text"`
	Comments  []primitive.ObjectID `bson:"comments" json:"comments"`
	CreatedAt time.Time            `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time            `bson:"updatedAt" json:"updatedAt"`
}

// ScoreWithUserDetails includes user information along with the score
type ScoreWithUserDetails struct {
	ID        primitive.ObjectID       `json:"_id,omitempty"`
	Owner     UserResponse             `json:"owner"`
	Value     int                      `json:"value"`
	Text      string                   `json:"text"`
	Comments  []CommentWithUserDetails `json:"comments"`
	CreatedAt time.Time                `json:"createdAt"`
	UpdatedAt time.Time                `json:"updatedAt"`
}
