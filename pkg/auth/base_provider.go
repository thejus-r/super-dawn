package auth

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"golang.org/x/oauth2"
)

type BaseProvider struct {
	ctx          context.Context
	clientId     string
	clientSecret string
	displayName  string
	redirectURL  string
	authURL      string
	tokenURL     string
	userInfoURL  string
	scopes       []string
	pkce         bool
}

func (p *BaseProvider) Context() context.Context {
	return p.ctx
}

func (p *BaseProvider) SetContext(ctx context.Context) {
	p.ctx = ctx
}

func (p *BaseProvider) PKCE() bool {
	return p.pkce
}

func (p *BaseProvider) SetPKCE(enable bool) {
	p.pkce = enable
}

func (p *BaseProvider) DisplayName() string {
	return p.displayName
}

func (p *BaseProvider) SetDisplayName(displayName string) {
	p.displayName = displayName
}

func (p *BaseProvider) Scopes() []string {
	return p.scopes
}

func (p *BaseProvider) SetScopes(scopes []string) {
	p.scopes = scopes
}

func (p *BaseProvider) ClientId() string {
	return p.clientId
}

func (p *BaseProvider) SetClientId(clientId string) {
	p.clientId = clientId
}

func (p *BaseProvider) ClientSecret() string {
	return p.clientSecret
}

func (p *BaseProvider) SetClientSecret(secret string) {
	p.clientSecret = secret
}

func (p *BaseProvider) RedirectURL() string {
	return p.redirectURL
}

func (p *BaseProvider) SetRedirectURL(url string) {
	p.redirectURL = url
}

func (p *BaseProvider) AuthURL() string {
	return p.authURL
}

func (p *BaseProvider) SetAuthURL(url string) {
	p.authURL = url
}

func (p *BaseProvider) Client(token *oauth2.Token) *http.Client {
	return p.oauth2Config().Client(p.ctx, token)
}

func (p *BaseProvider) FetchRawUserInfo(token *oauth2.Token) ([]byte, error) {

	req, err := http.NewRequestWithContext(p.ctx, "GET", p.userInfoURL, nil)
	if err != nil {
		return nil, err
	}
	return p.sendRawUserInfoRequest(req, token)
}

func (p *BaseProvider) sendRawUserInfoRequest(req *http.Request, token *oauth2.Token) ([]byte, error) {
	client := p.Client(token)

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	result, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	if res.StatusCode >= 400 {
		return nil, fmt.Errorf(
			"failed to fetch OAuth2 user profile via %s (%d):\n%s",
			p.userInfoURL,
			res.StatusCode,
			string(result),
		)
	}
	return result, err
}

func (p *BaseProvider) oauth2Config() *oauth2.Config {
	return &oauth2.Config{
		RedirectURL:  p.redirectURL,
		ClientID:     p.clientId,
		ClientSecret: p.clientSecret,
		Endpoint: oauth2.Endpoint{
			AuthURL:  p.authURL,
			TokenURL: p.tokenURL,
		},
	}

}
