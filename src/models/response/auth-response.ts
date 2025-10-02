export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  refresh_token_expires: string;
  user: {
    id: string;
    phone: string;
    fullname: string;
    email: string;
    companyName: string;
    roles: [];
  };
}

