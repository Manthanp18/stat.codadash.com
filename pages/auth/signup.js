import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import bcrypt from 'bcryptjs'
import { Envelope, Key, Person } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'
import { Load } from '../../components/Load'
import Toast from '../../components/Toast'
import axios from 'axios'

export default function Signup() {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [session, loading] = useSession()
  const [success, setSuccess] = useState(false)
  const [show, setShow] = useState(false)
  const [allow, setAllow] = useState(false)
  const { handleSubmit, formState: { errors }, control, getValues, setError } = useForm()
  const router = useRouter()

  const onSubmit = (data) => {
    if (!data.email) {
      setError("email", {
        type: "manual",
        message: "No Email Provided"
      })
      return
    } else if (!data.alias) {
      setError("alias", {
        type: "manual",
        message: "No Alias Provided"
      })
      return
    } 
    setSubmitting(true)
    // console.log(data)
      bcrypt.hash(data.password, 10, (err, hash) => {
        axios.post('/api/user', {
            email: data.email,
            password: hash,
            alias: data.alias
          })
          .then((res) => {
            // console.log('success', res.data)
            setSuccess(true)
            signIn('credentials', {
              email: data.email,
              password: data.password,
              callbackUrl: ''
            })
          })
          .catch((err) => {
            if (!err.response.data.msg) {
              console.error(err)
              return
            }
            console.error(err.response.data.msg)
            if (err.response.data.msg.includes('already exists')) {
              setShow(true)
            } else if (err.response.data.msg.includes('Email not on allow list')) {
              setAllow(true)
            }
          })
        .finally(() => setSubmitting(false))
      })
  }

  if (session) router.push('/')

  return (
    <>
      <h1 className="display-3 mt-3">Sign Up</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Envelope className="mr-3 mb-2" size={30} />
        <Form.Label>Email</Form.Label>
        <Controller
          render={({ field }) => <Form.Control {...field} type="email" placeholder="name@example.com" />}
          control={control}
          name="email"
          defaultValue=""
          
          required
          rules={{
            validate: () => {
              if (
                !/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/.test(
                  getValues('email')
                )
              )
                return false
            }
          }}
        />
        {errors.email && (
          <p className="text-center mt-2 errMsg">
            Please enter a valid email
          </p>
        )}
        <Person className="mr-3 mb-2" size={30} />
        <Form.Label>Alias</Form.Label>
        <Controller
          render={({ field }) => <Form.Control {...field} placeholder="Alias" />}
          control={control}
          name="alias"
          defaultValue=""
          required
        />
        {errors.alias && (
          <p className="text-center mt-2 errMsg">
            Please enter a valid alias
          </p>
        )}
        <Key className="mr-3 mb-1" size={30} />
        <Form.Label>Password</Form.Label>
        <Controller
          render={({ field }) => <Form.Control {...field} type="password" placeholder="Password" />}
          control={control}
          name="password"
          
          defaultValue=""
          required
          rules={{
            minLength: 8 // sets rule pass >= 8
          }}
        />
        {errors?.password && (
          <p className="errMsg">Your password must be at least 8 characters</p>
        )}
        <Key className="mr-3 mb-1" size={30} />
        <Form.Label>Confirm Password</Form.Label>
        <Controller
          render={({ field }) => <Form.Control {...field} type="password" placeholder="Confirm Password" />}
          control={control}
          name="confirmPass"
          
          defaultValue=""
          required
          rules={{
            validate: () => {
              return getValues('password') === getValues('confirmPass')
            }
          }}
        />
        {errors.confirmPass && (
          <p className="errMsg">Your password must match</p>
        )}
        <Row>
          {submitting 
            ? <Load />
            : <Button
                className="mx-auto my-5"
                style={{ width: '97.3%' }}
                variant="primary"
                type="submit"
              >
                Sign Up
              </Button>
          }
        </Row>
      </Form>
      <div style={{ position: 'fixed', top: '120px', right: '20px' }}>
        <Toast
          show={show}
          setShow={setShow}
          title="Email Taken"
          error
          body={
            <h5 className="text-danger">
              An account already exists with that Email Address.
            </h5>
          }
        />
        <Toast
          show={allow}
          setShow={setAllow}
          title="Email Not on the Allow List"
          error
          body={
            <h5 className="">
              Please contact the admin to be placed on the allowlist.
            </h5>
          }
        />
      </div>
    </>
  )
}
