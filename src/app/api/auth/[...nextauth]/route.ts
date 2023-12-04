import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "../../../../../sanity/lib/client";
import { employee } from "@/Types/types";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user: employee[] = await client.fetch('*[_type == "employee" ]');
        const isUser = user.find(
          (e) =>
            e.fullName.toLowerCase() === req.body?.username.toLowerCase() &&
            e.password === req.body?.password &&
            e.role === req.body?.role.toLowerCase()
        );
        if (isUser) {
          const customUserData = {
            id: isUser._id,
            name: isUser.fullName,
            role: isUser.role,
          };
          return Promise.resolve(customUserData);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  secret: "0df0hq_lh°==fioh11fqfqfh11lqhizflkfx_",
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    jwt: async (params) => {
      const { token, user } = params;
      interface Data extends User {
        role: string;
      }
      const data = user as Data;
      console.log(data);
      if (user) {
        token.id = data.id;
        token.name = data.name;
        token.role = data.role;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token, user }) => {
      session.user = {
        id: token.id,
        name: token.name,
        role: token.role,
      } as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
