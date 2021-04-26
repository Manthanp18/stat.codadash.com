import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { compare } from 'bcryptjs'
import { connectDB } from '../../../util/db'
import { User } from '../../../models'

export const config = {
  api: {
    externalResolver: true
  }
}

export default (req, res) => {
  NextAuth(req, res, {
    providers: [
      Providers.Credentials({
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
    callbacks: {
      session: async (session, user) => {
        // console.log((session, user))
        if (session) session.id = user.id
        return Promise.resolve(session)
      },
      jwt: async (token, user) => {
        if (user) token.id = user.id
        return Promise.resolve(token)
      }
    },
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/logout',
      newUser: '/auth/signup',
      error: '/' // Error code passed in query string as ?error=
    },
    secret: process.env.NEXTAUTH_SECRET
  })
}