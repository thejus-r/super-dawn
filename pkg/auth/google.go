package auth

import (
	"context"
	"encoding/json"

	"golang.org/x/oauth2"
)

func init() {
	Providers[NameGoogle] = wrapFactory(NewGoogleProvider)
}

var _ Provider = (*Google)(nil)

const NameGoogle string = "google"

type Google struct {
	BaseProvider
}

func NewGoogleProvider() *Google {
	return &Google{BaseProvider{
		ctx:         context.Background(),
		displayName: "Google",
		pkce:        true,
		scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		},
		authURL:     "https://accounts.google.com/o/oauth2/v2/auth",
		tokenURL:    "https://oauth2.googleapis.com/token",
		userInfoURL: "https://www.googleapis.com/oauth2/v3/userinfo",
	}}
}

func (p *Google) FetchAuthUser(token *oauth2.Token) (*AuthUser, error) {
	data, err := p.FetchRawUserInfo(token)
	if err != nil {
		return nil, err
	}

	rawUser := map[string]any{}

	if err := json.Unmarshal(data, &rawUser); err != nil {
		return nil, err
	}

	extracted := struct {
		Id            string `json:"id"`
		Name          string `json:"name"`
		Picture       string `json:"picture"`
		Email         string `json:"email"`
		EmailVerified bool   `json:"email_verified"`
	}{}

	if err := json.Unmarshal(data, &extracted); err != nil {
		return nil, err
	}

	user := &AuthUser{
		Id:           extracted.Id,
		Name:         extracted.Name,
		AvatarURL:    extracted.Picture,
		RawUser:      rawUser,
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
	}

	user.Expiry = token.Expiry

	if extracted.EmailVerified {
		user.Email = extracted.Email
	}
	return user, nil
}
