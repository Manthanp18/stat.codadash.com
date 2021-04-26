import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function SampleModal({msg}) {
  const [show, setShow] = useState(true)

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {msg}
        <hr/>
        <div className="mx-auto text-center">
          <a href="https://github.com/codabool/stat.codadash.com">Github page</a>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShow(false)}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
