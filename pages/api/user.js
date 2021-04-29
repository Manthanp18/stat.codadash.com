import { User } from '../../models'
import applyMiddleware from '../../util'
// import { getSession } from 'next-auth/client'

export default applyMiddleware(async (req, res) => {
  try {
    const { method, body, query } = req
    if (method === 'POST') {
      const allowedList = process.env.ALLOWLISTED_EMAILS || ''
      let arr = allowedList.split(',') || []
      arr = arr.map(email => email.toLowerCase())
      const allowed = arr.includes(body.email.toLowerCase())
      if (!allowed) throw 'Email not on allow list'
      await User.create({
        email: body.email,
        password: body.password,
        alias: body.alias
      })
        .then(resp => {
          if (resp.code === 11000) throw 'User already exists'
          res.status(200).json(resp)
        })
        .catch(err => {
          if (err.code === 11000) throw 'User already exists'
          console.log(err)
          throw err._message
        })
    } else if (method === 'GET') {
      // const user = await User.findOne({ email: query.email.toLowerCase() })
      // res.status(200).json(user)
      return
    } else if (method === 'PUT') {
      // new: true => returns the updated document
      // const user = await User.findOneAndUpdate({ email: body.email.toLowerCase() }, data, { new: true })
      //   .catch(err => {
      //     console.log(err)
      //     throw err._message
      //   })
      // res.status(200).json(user)
      return
    } else {
      throw `Cannot use ${method} method for this route`
    }
  } catch (err) {
    if (typeof err === 'string') {
      res.status(400).json({ msg: '/user: ' + err })
    } else {
      res.status(500).json({ msg: '/user: ' + (err.message || err)})
    }
  }
})