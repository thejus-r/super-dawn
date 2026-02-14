package auth

import (
	"context"
	"errors"
	"time"

	"golang.org/x/oauth2"
)

type ProviderFactoryFunc func() Provider

type Provider interface {
	// Context returns the context associated with the provider (if any).
	Context() context.Context

	// SetContext assigns the specified context to the current provider.
	SetContext(ctx context.Context)

	// PKCE indicates whether the provider can use the PKCE flow.
	PKCE() bool

	// SetPKCE toggles the state whether the provider can use the PKCE flow or not.
	SetPKCE(enable bool)

	// DisplayName usually returns provider name as it is officially written
	// and it could be used directly in the UI.
	DisplayName() string

	// SetDisplayName sets the provider's display name.
	SetDisplayName(displayName string)

	// Scopes returns the provider access permissions that will be requested.
	Scopes() []string

	// SetScopes sets the provider access permissions that will be requested later.
	SetScopes(scope []string)

	// ClientId returns the clientId
	ClientId() string

	// SetClient Id sets the clientId for the provider
	SetClientId(clientId string)

	// Gets the client secret
	ClientSecret() string

	// Gets the client secret
	SetClientSecret(secret string)

	RedirectURL() string

	SetRedirectURL(url string)

	AuthURL() string

	SetAuthURL(url string)

	TokenURL() string

	SetTokenURL(url string)

	FetchRawUserInfo(token *oauth2.Token) ([]byte, error)
}

var Providers = map[string]ProviderFactoryFunc{}

func NewProviderByName(name string) (Provider, error) {
	factory, ok := Providers[name]
	if !ok {
		return nil, errors.New("missing provider " + name)
	}

	return factory(), nil
}

// wrapFactory is a helper that wraps a Provider specific factory
// function and returns its result as Provider interface.
func wrapFactory[T Provider](factory func() T) ProviderFactoryFunc {
	return func() Provider {
		return factory()
	}
}

type AuthUser struct {
	Expiry       time.Time      `json:"expiry"`
	RawUser      map[string]any `json:"rawUser"`
	Id           string         `json:"id"`
	Name         string         `json:"name"`
	Username     string         `json:"username"`
	Email        string         `json:"email"`
	AvatarURL    string         `json:"avatarURL"`
	AccessToken  string         `json:"accessToken"`
	RefreshToken string         `json:"refreshToken"`
}
