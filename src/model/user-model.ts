export interface User {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: string;
}

export interface UserResponse {
  email: string;
  phone: string;
  name: string;
  role: string;
}

export interface LoginUserResponse extends UserResponse {
  token: string;
}

export interface RegisterUserRequest {
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
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
}
