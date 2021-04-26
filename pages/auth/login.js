import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Envelope, Key } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { useRouter } from 'next/router'
import { Load } from '../../components/Load'
// import { signIn, useSession } from 'next-auth/client'

export default function Login() {
  // const [session, loading] = useSession()
  const [error, setError] = useState(null)
  
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'onSubmit'})
  const router = useRouter()

  useEffect(() => {
    if (router.query.error === 'nonexistant') setError('No user found by that email')
    if (router.query.error === 'invalid') setError('Invalid login')
    if (router.query.error === 'unkown') setError('Something went wrong')
  }, [router.query.error])

  const onSubmit = async data => {
    alert('sample environment')
    // console.log(data)
    // if (data.email && data.password) {
    //   signIn('credentials', {
    //     email: data.email,
    //     password: data.password
    //   })
    // }
  }

  // if (session) {
  //   router.push('/')
  //   return <Load />
  // }

  return (
    <>
      <h1 className="my-4 display-3">Login</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Envelope className="mr-3 mb-1" size={30} />
          <Form.Label>Email</Form.Label>
          <Controller
            render={({ field }) => <Form.Control {...field} type="email" placeholder="name@example.com" />}
            control={control}
            name="email"
            defaultValue=""
            
            required
          />
        </Form.Group>
        <Form.Group>
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
          {errors.password && (
            <p className="errMsg">
              Your password must be at least 8 characters
            </p>
          )}
        </Form.Group>
        <Row>
          {error && <h4 className="text-danger mt-4 mx-auto">{error}</h4>}
          <Button
            className="mx-auto mt-5"
            style={{ width: '97.3%' }}
            variant="primary"
            type="submit"
          >
            Login
          </Button>
        </Row>
        <p
          className="my-5 text-center signupText"
          onClick={() => router.push(`/auth/signup`)}
        >
          New Around? Signup Here.
        </p>
      </Form>
    </>
  )
}
