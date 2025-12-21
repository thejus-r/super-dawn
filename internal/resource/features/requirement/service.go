package requirement

import (
	"context"

	"github.com/thejus-r/super-dawn/internal/resource/domain"
)

type RequirementService struct {
	repo domain.RequirementRepository
}

// Initilizes Service
func InitService(repo domain.RequirementRepository) *RequirementService {
	return &RequirementService{
		repo: repo,
	}
}

func (svc *RequirementService) CreateRequirement(ctx context.Context, name string) {
	svc.repo.Create(ctx, name)
}

func (svc *RequirementService) ListRequirements(ctx context.Context) ([]domain.Requirement, error) {
	return svc.repo.List(ctx)
}
