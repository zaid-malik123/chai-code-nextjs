import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    email: string;
    userName: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }

  interface Session {
    user: {
      _id: string;
      email: string;
      userName: string;
      isVerified: boolean;
      isAcceptingMessage: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    email: string;
    userName: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }
}

export {}