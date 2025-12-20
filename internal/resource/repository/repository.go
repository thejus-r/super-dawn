package repository

import (
	"context"
	"database/sql"
)

type Repository struct {
	Requirements interface {
		CreateRequirement(context.Context, string) (*Requirement, error)
	}
}

func NewStorage(db *sql.DB) Repository {
	return Repository{
		Requirements: &RequirementRepo{db},
	}
}
