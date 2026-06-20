export interface RegisterProps {
  username: string;
  password: string;
  token: string;
}

export interface LoginProps {
  username: string;
  password: string;
}

export interface AdminEditServerProps {
  id: string;
  name: string;
  domain: string;
  icon: string;
  token: string;
}
