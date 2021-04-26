import Spinner from 'react-bootstrap/Spinner'
import { signIn } from 'next-auth/client'

export const Load = ({ msg }) => (
  <>
    <Spinner
      animation="border"
      variant="info"
      style={{ margin: '20% auto 0 auto', display: 'block' }}
    />
    <h3 className="text-center m-5" style={{ animation: 'fadein 8s' }}>
      {msg}
    </h3>
  </>
)

export function isLoad(session, loading, required) {
  if (loading) return true
  if (session === null && !loading && required) { signIn(); return true }
  return false
}
