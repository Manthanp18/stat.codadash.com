import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { connectDB } from '../../../util/db'
import { User } from '../../../models'

export default (req, res) => (
  NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'Email' },
          password: {
            label: 'Password',
            type: 'password',
            placeholder: 'Password'
          }
        },

        authorize: async (clientData) => {
          try {
            await connectDB()
            const user = await User.findOne({ email: clientData.email })
              .catch(err => {
                console.log(err)
                return Promise.reject('/auth/login?error=unknown')
              })
            if (user) {
              const validPassword = await compare(
                clientData.password,
                user.password
              )
              if (validPassword) { // complete successful login
                return { id: user._id, email: user.email }
              } else { // invalid password
                return Promise.reject('/auth/login?error=invalid')
              }
            } else {
              return Promise.reject('/auth/login?error=nonexistant')
            }
          } catch (err) {
            return Promise.reject('/auth/login?error=unknown')
          }
        }
      })
    ],
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/logout',
      newUser: '/auth/signup',
      error: '/auth/login', // Error code passed in query string as ?error=
    },
    debug: true,
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60 * 100, // 30 days
    },
    callbacks: {
      async session({ session, token, user }) {
        if (session) session.id = token.sub
        return Promise.resolve(session)
      },
      async jwt({ token, user }) {
        if (token) token.id = token.sub
        return Promise.resolve(token)
      }
    }
  })
)