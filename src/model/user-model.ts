export interface User {
  username: string;
  email: string;
  phone: string;
  password: string;
  name: string;
  role: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  name: string;
  role: string;
}

export interface LoginUserResponse extends UserResponse {
  token: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
  name: string;
  role?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  name?: string;
  password?: string;
  role?: string;
}

export function toUserRespons(user: any): UserResponse {
  return{
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
}
