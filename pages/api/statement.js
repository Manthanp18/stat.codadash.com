import { Statement, User } from '../../models'
import dbConnect from '../../util/db'
import { getSession } from 'next-auth/react'
import mongoose from 'mongoose'

let body = null

export default async (req, res) => {
  try {
    const { method, body:rawBody, query } = req
    if (rawBody.length) body = JSON.parse(rawBody)
    await dbConnect()
    const session = await getSession({ req })
    if (!session) throw 'Unauthorized'
    if (method === 'POST') {
      const user = await User.findOne({ email: session.user.email.toLowerCase() })
      if (!user) throw `Could Not find ${session.user.email}`
      if (!body.date) throw `date ${body.date}`
      const statement = await Statement.create({
        user: user.id, 
        alias: user.alias, 
        description: body.description, 
        amount: Number(body.amount), 
        createdAt: body.date
      })
        .catch(err => {throw err._message})
      res.status(200).json(statement)
    } else if (method === 'GET') {
      const user = await User.findOne({ email: session.user.email.toLowerCase() })
      if (!user) throw `Could Not find ${session.user.email}`
      const agg = await getAgg()
        .catch(err => {throw err})
      res.status(200).json(agg[0])
    } else if (method === 'DELETE') {
      const user = await User.findOne({ email: session.user.email.toLowerCase() })
      if (!user.admin) throw 'Unathorized'
      const statement = await Statement.deleteOne({ _id: query.id })
        .catch(err => {throw err._message})
      res.status(200).json(statement)
    } else if (method === 'PUT') {
      for (const obj of body) {
        // TODO: could detect changes smarter here
        if (isNaN(Number(obj.data.amount))) {
          throw 'Cannot cast amount to Number'
        }
        await Statement.findByIdAndUpdate(
          mongoose.Types.ObjectId(obj.id),
          {
            amount: Number(obj.data.amount),
            createdAt: obj.data.date,
            description: obj.data.desc
          }
        ).catch(err => {throw err._message})
      }
      res.status(200).json({msg: 'hi'})
    } else {
      throw `Cannot use ${method} method for this route`
    }
  } catch (err) {
    console.log('outter', err)
    if (typeof err === 'string') {
      res.status(400).json({ msg: '/statement: ' + err })
    } else {
      res.status(500).json({ msg: '/statement: ' + (err.message || err)})
    }
  }
}

function getAgg() {
  return Statement.aggregate([
    {
      "$facet": {
        "bar": [
          {
            $group: {
              _id: {
                id: "$_id",
                alias: "$alias",
                month: {
                  $month: {
                    date: "$createdAt"
                  }
                },
                year: {
                  $year: {
                    date: "$createdAt"
                  }
                },
                createdAt: "$createdAt"
              },
              total: {
                $sum: "$amount"
              }
            }
          },
          {
            $group: {
              _id: {
                alias: "$_id.alias",
                year: "$_id.year",
                month: "$_id.month",
                
              },
              total: {
                $sum: "$total"
              },
              
            }
          },
          {
            $set: {
              month: "$_id.month",
              year: "$_id.year",
              alias: "$_id.alias"
            }
          },
          {
            $sort: {
              year: 1,
              month: 1
            }
          }
        ],
        "raw": [
          {
            $match: {}
          }
        ],
        "doughnut": [
          {
            $group: {
              _id: {
                alias: "$alias"
              },
              total: {
                $sum: "$amount"
              }
            }
          },
          {
            $set: {
              alias: "$_id.alias"
            }
          }
        ]
      }
    }
  ])
}