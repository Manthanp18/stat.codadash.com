import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function About() {
  return (
    <>
      <h1 className="display-1 my-3">About</h1>
      <Row>
        <Col md={6} className="aboutSummary p-3">
          <h5 className="display-4">Simple Payment Tracking 💵</h5>
          <h4>
            &emsp;This application can be used to keep track of payments toward any goal.
            You own your own data, payments entered into the app connect to your self-hosted database.
            No data is collected to any external source besides your own database.
            Security practices follow industry standard and is secure by default with the use of an allowlist.
            If not hosting locally, a vercel deployment is recommended. Read more about how to self-host on the repo page <a href="https://github.com/codabool/stat.codadash.com">here</a>
          </h4>
        </Col>
        <Col md={6}>
          <img src="/image/table.jpg" className="rounded shadow w-100 mb-3" />
        </Col>
        <Col md={6}>
          <div className="aboutTech">
            <img src="/image/pie.jpg" className="rounded w-100 mt-3" />
          </div>
        </Col>
        <Col md={6} className="aboutSummary p-3">
          <h5 className="display-4">Under the Hood 🧰</h5>
          <ul style={{fontSize: '2em'}}>
            <dd className="d-inline">- Next.js </dd><span className="text-muted"> (Front end)</span><br />
            <dd className="d-inline">- next-auth </dd><span className="text-muted"> (Authentication)</span><br />
            <dd className="d-inline">- Chart.js </dd><span className="text-muted"> (Charts)</span><br />
            <dd className="d-inline">- MongoDB </dd><span className="text-muted"> (Database)</span><br />
          </ul>
          <Row>
            <p className="text-muted mx-auto" style={{fontSize: '1.1rem'}}>Read More at <a href="https://codabool.com">CodaBool.com</a></p>
          </Row>
          {process.env.NEXT_PUBLIC_BUILD_ID &&
            <p className="text-muted text-center" style={{opacity: '.3'}}>build {process.env.NEXT_PUBLIC_BUILD_ID}</p>
          }
        </Col>
      </Row>
    </>
  )
}
