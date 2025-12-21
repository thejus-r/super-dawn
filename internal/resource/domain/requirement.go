package domain

import "context"

type Requirement struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type CreateRequirementPayload struct {
	Name string `json:"name"`
}

type RequirementRepository interface {
	Create(context.Context, string) (*Requirement, error)
	List(context.Context) ([]Requirement, error)
}
