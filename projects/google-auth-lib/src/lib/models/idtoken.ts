export interface Idtoken {
  azp:            string;
  aud:            string;
  sub:            string;
  email:          string;
  email_verified: boolean;
  at_hash:        string;
  nonce:          string;
  exp:            number;
  iss:            string;
  jti:            string;
  iat:            number;
  name:           string;
  picture:        string;
  given_name:     string;
  locale:         string;
}
