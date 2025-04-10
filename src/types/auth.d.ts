import { IUser } from "../models/User";

declare global {
  namespace Auth {
    type Schema = {
      email: string;
      password: string;
    };

    type ContextWithJWT = Context & {
      jwt: {
        readonly sign: (
          morePayload: Record<string, string | number>
        ) => Promise<string >;
        readonly verify: (
          jwt?: string | undefined
        ) => Promise<false | Record<string, string | number>>;
      };
    };

    type ContextWithUser = ContextWithJWT & {
      readonly user: User.Schema;
    };
  }
}

export {};
