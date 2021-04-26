import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import axios from 'axios'

import { isLoad, Load } from '../components/Load'
import Doughnut from '../components/Doughnut'
import Bars from '../components/Bars'
import History from '../components/History'
import Detail from '../components/Detail'
import useScreen from '../constants/useScreen'

export default function index() {
  const [session, loading] = useSession()
  const [key, setKey] = useState('history')
  const [data, setData] = useState()
  let screen = useScreen()
  if (!screen) screen = 'medium'
  
  useEffect(() =>  {
    if (session) getData()
  }, [session])

  if (isLoad(session, loading, true)) return <Load msg='Please reload the page' />

  async function getData() {
    if (!session?.id) return
    const all = await axios.get('/api/statement')
      .then(res => res.data)
      .catch(err => {console.error(err); return}) // Getting err.response undefined err.response.data.msg
    // console.log(all)
    setData(all)
  }  

  return (
    <>
      <Row>
        <Col lg={8}>
          <div className={`${!screen.includes('small') && 'p-5'} mt-3`}>
            {data && <Bars data={data.bar} screen={screen} />}
          </div>
        </Col>
        <Col lg={4}>
          <div className={`${!screen.includes('small') && 'p-5 mb-3'}`}>
            {data && <Doughnut data={data.doughnut} />}
          </div>
        </Col>
      </Row>
      <>
        <Tabs
          id="tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mt-2"
        >
          <Tab eventKey="history" title="History">
            <History data={data} getData={getData} session={session} />
          </Tab>
          <Tab eventKey="detail" title="Detail">
            <Detail />
          </Tab>
        </Tabs>
      </>
    </>
  )
}
