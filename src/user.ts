import bcrypt from "bcrypt";



// Interface for Signup Request
export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function hashPassword(user: UserRequest) {
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(user.password, salt);

    return {
      ...user,
      password: undefined,
      passwordHash,
    };
  }


