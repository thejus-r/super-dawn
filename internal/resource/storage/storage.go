package storage

import (
	"database/sql"

	"github.com/thejus-r/super-dawn/internal/resource/domain"
)

type Storage struct {
	domain.RequirementRepository
}

func InitStorage(db *sql.DB) Storage {
	return Storage{
		RequirementRepository: &RequirementStore{db},
	}
}
