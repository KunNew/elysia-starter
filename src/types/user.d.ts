import { IUser } from "../models/user";

declare global {
  namespace User {
    type Schema = {
      email: string;
      password: string;
      name: string;
      profilePicture?: string;
      role?: "user" | "admin";
      isActive?: boolean;
    };
    type Input = {
      _id?: string;
      email: string;
      password: string;
      name: string;
      profilePicture?: string;
      role?: "user" | "admin";
      isActive?: boolean;
    };
  }
}

export {};
