package identity

type IdentityUser struct {
	ID       string
	Email    string
	Password string // hashed
	Role     string
}

type UserRepository interface {
	FindByEmail(email string) (*IdentityUser, error)
	Save(user *IdentityUser) error
}

type IdentityService struct {
	repo      UserRepository
	jwtSecret string
}

func New(repo UserRepository, secret string) *IdentityService {
	return &IdentityService{
		repo:      repo,
		jwtSecret: secret,
	}
}
