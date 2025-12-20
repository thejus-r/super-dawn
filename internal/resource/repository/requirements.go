package repository

import (
	"context"
	"database/sql"
)

type Requirement struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type RequirementRepo struct {
	db *sql.DB
}

func (r *RequirementRepo) CreateRequirement(ctx context.Context, name string) (*Requirement, error) {

	requirement := &Requirement{}

	query := `
		INSERT INTO requirement (name) VALUES ($1)
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		name,
	).Scan(
		&requirement.ID,
		&requirement.Name,
	)

	if err != nil {
		return nil, err
	}
	return requirement, nil
}
