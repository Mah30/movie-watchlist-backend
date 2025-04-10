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

    // Retorna apenas os campos esperados pelo Prisma
    //Essa estrutura (const {password, ...userData} = user ) quer dizer: #Pegue o campo password de dentro de user, Guarde tudo o que não for password no novo objeto chamado userData
    const {password, ...userData} = user 

    return {
      ...userData,
      passwordHash, // senha criptografada
    };
  }


