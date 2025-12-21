package storage

import (
	"context"
	"database/sql"

	"github.com/thejus-r/super-dawn/internal/resource/domain"
)

type RequirementStore struct {
	db *sql.DB
}

func (s *RequirementStore) Create(ctx context.Context, name string) (*domain.Requirement, error) {
	return nil, nil
}

func (s *RequirementStore) List(ctx context.Context) ([]domain.Requirement, error) {

	query := `
		SELECT * FROM requirements;
	`

	rows, err := s.db.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()
	requirements := []domain.Requirement{}

	for rows.Next() {
		var r domain.Requirement
		err := rows.Scan(&r.ID, &r.Name)
		if err != nil {
			return nil, err
		}
		requirements = append(requirements, r)
	}
	return requirements, nil
}
