import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const style = {
  cursor: 'pointer',
  fontSize: '2rem',
  lineHeight: '1',
  margin: '0 2rem 0 2rem'
}

export default function Navigation() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Link href="/" passHref legacyBehavior>
        <Navbar.Brand onClick={() => router.push('/')} style={style}>Home</Navbar.Brand>
        {/* <Nav.Link to="/" style={style}>Home</Nav.Link> */}
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {session ? (
            <>
              {session.user.email === 'codabool@pm.me' &&
                <Link href="/admin" passHref legacyBehavior>
                  <Nav.Link className={`${router.asPath.includes('/admin') && 'active'}`} to="/admin" style={style} eventKey="1">Admin</Nav.Link>
                </Link>
              }
              <Link href="/" passHref legacyBehavior>
                <Nav.Link className={`${router.asPath === '/' && 'active'}`} to="/" style={style} eventKey="2">Charts</Nav.Link>
              </Link>
              <Link href="/auth/logout" passHref legacyBehavior>
                <Nav.Link className={`${router.asPath === '/auth/logout' && 'active'}`} to="/auth/logout" style={style} eventKey="3">Logout</Nav.Link>
              </Link>
            </>
          ) : (
            <Link href="/auth/login" passHref legacyBehavior>
              <Nav.Link className={`${router.asPath === '/auth/login' && 'active'}`} to="/auth/login" style={style} eventKey="4">Login</Nav.Link>
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}