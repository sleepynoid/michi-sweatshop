export interface User {
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface LoginUserResponse extends UserResponse {
  token: string;
}

export interface RegisterUserRequest {
  username: string;
  password: string;
  name: string;
  role?: string;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  role?: string;
}

export function toUserRespons(user: any): UserResponse {
  return{
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role
  }
}
