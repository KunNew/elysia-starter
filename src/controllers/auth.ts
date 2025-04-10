import { Context } from "elysia";
import User from "../models/User";


export const Login = async (ctx: Auth.ContextWithJWT) => {
  const { email, password } = ctx.body as Auth.Schema;

  const user = await User.findByEmail(email);
  if (!user) {
    ctx.set.status = 401;
    throw new Error("User not found");
  }
  const token = await ctx.jwt.sign({ id: user._id });
  // Check if the password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    ctx.set.status = 401;
    throw new Error("Invalid credentials!");
  }
  return {
    message: "User logged in successfully!",
    data: token,
  };
};
