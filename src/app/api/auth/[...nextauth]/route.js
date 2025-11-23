import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseClient } from "@/lib/supabase";
import { google } from 'googleapis';
import crypto from 'crypto';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!supabaseClient) {
        console.error("Supabase client not initialized in signIn callback");
        return false;
      }

      try {
        const { data, error } = await supabaseClient
          .from("usuarios")
          .select("email")
          .eq("email", user.email);

        if (error) {
          console.error("Error fetching user in signIn:", error);
          // No bloquear login si falla la BD, pero loguear error
        }

        if (account?.refresh_token) {
          try {
            const encryptedRefresh = encrypt(account.refresh_token);
            await supabaseClient.from("usuarios").upsert({
              email: user.email,
              refresh_token: encryptedRefresh,
            }, { onConflict: ['email'] });
          } catch (err) {
            console.error("Error saving refresh token:", err);
          }
        }

        if (!data || data.length === 0) {
          await supabaseClient.from("usuarios").insert({
            nombre: user.name,
            email: user.email,
            imagenUrl: user.image,
            role: "member",
          });
        }

        return true;
      } catch (error) {
        console.error("Critical error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      // Guardar accessToken y refreshToken en el primer login
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000;
        token.email = account.id_token ? user?.email : token.email;
      }

      // Si el token expiró, refrescarlo
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        let refreshTokenToUse = token.refreshToken;
        if (!refreshTokenToUse && token.email) {
          const { data: usuarios } = await supabaseClient
            .from("usuarios")
            .select("refresh_token")
            .eq("email", token.email)
            .single();
          if (usuarios?.refresh_token) {
            refreshTokenToUse = decrypt(usuarios.refresh_token);
          }
        }
        if (refreshTokenToUse) {
          try {
            const client = new google.auth.OAuth2(
              process.env.GOOGLE_CLIENT_ID,
              process.env.GOOGLE_CLIENT_SECRET
            );
            client.setCredentials({ refresh_token: refreshTokenToUse });
            const { credentials } = await client.refreshAccessToken();
            token.accessToken = credentials.access_token;
            token.accessTokenExpires = credentials.expiry_date;
            if (credentials.refresh_token) {
              token.refreshToken = credentials.refresh_token;
              if (token.email) {
                const encryptedRefresh = encrypt(credentials.refresh_token);
                await supabaseClient.from("usuarios").update({ refresh_token: encryptedRefresh }).eq("email", token.email);
              }
            }
            token.error = undefined;
          } catch (e) {
            console.error('Error refrescando access token:', e);
            token.error = "RefreshAccessTokenError";
          }
        } else {
          // No hay refresh token, forzar logout
          // token.error = "NoRefreshToken";
          console.warn("No refresh token available, but keeping session active.");
        }
      }

      if (user?.email) {
        const { data: usuarios } = await supabaseClient
          .from("usuarios")
          .select("*");
        const usuario = usuarios?.find((u) => u.email === user.email);
        token.role = usuario?.role ?? "member";
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.error = token.error;
      return session;
    },
  },
});

function encrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.REFRESH_TOKEN_SECRET, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.REFRESH_TOKEN_SECRET, 'hex');
  const [ivHex, encrypted] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export { handler as GET, handler as POST };
