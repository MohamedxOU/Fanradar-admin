export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  //for roles it may have multiple values, so we use an array
  role: string[];
  created_at: string;
  updated_at: string;
  //optional for auth token
  auth_token?: string;
}
