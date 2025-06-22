// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export interface UserInterface {
  id: number;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  emailVerifiedTime: Date | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      verified?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    verified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    verified?: boolean;
  }
}
