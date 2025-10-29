import bcrypt from "bcryptjs";

export const generateSalt = () => {
  console.log(bcrypt.genSaltSync(12));
};

generateSalt();
