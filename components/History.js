import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { PlusSquare, XSquare, Calendar3, ArrowClockwise } from 'react-bootstrap-icons'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'timeago.js'
import axios from 'axios'

export default function History({ data, getData, session}) {
  const { handleSubmit, formState: { errors }, control, setError, reset } = useForm()
  const [readable, setReadable] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [spin, setSpin] = useState(false)

  useEffect(() => setAdmin(session?.user.email === 'codabool@pm.me'), [session])

  useEffect(() =>  {
    setSpin(true)
    setTimeout(() => setSpin(false), 1000)
  }, [data])

  function remove(id) {
    axios.delete('/api/statement', { params: { id } })
      .then(res => {
        // console.log(res.data)
        getData()
      })
      .catch(err => console.error(err.response.data.msg))
  }

  function onSubmit(input) {
    if (!input.amount) {
      setError("amount", {
        type: "manual",
        message: "No Amount Provided"
      })
      return
    } 

    axios.post('/api/statement', input)
      .then(() => getData())
      .catch(err => console.log(err)) // Getting err.response undefined err.response.data.msg
      .finally(() => reset({amount: '', description: ''}))
  }

  function runningTotal(index) {
    let total = 0
    data.raw.forEach(doc => {
      total += doc.amount
    })
    for (let i = 0; i < index; i++) {
      total -= data.raw[i].amount
    }
    return total
  }

  // dynamic row colors 
  // proven working when assigned to tr
  // className={`${getClass(row.description)}`} style={getStyle(row.description)}
  // function getStyle(text) {
  //   if (text.includes('some unique thing')) {
  //     return {color: 'red'}
  //   }
  //   return {}
  // }
  function getClass(text) {
    if (text.includes('SOME_SPECIFIC_TAG_HERE')) {
      return 'text-primary'
    }
    return ''
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{overflow: 'auto'}}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th><Calendar3 size={26} className="sway-on-hover" onClick={() => setReadable(!readable)} style={{ cursor: 'pointer' }} /></th>
            <th>Description</th>
            <th>By</th>
            <th>Amount</th>
            <th>Total</th>
            <th><ArrowClockwise size={26} className={`${spin && 'spin'} sway-on-hover`} onClick={getData} fill="#0069d9" /></th>
            {admin && <th style={{width: '0', padding: '0'}}></th>}
          </tr>
        </thead>
        <tbody>
          {data && data.raw.map((row, index) => (
            <tr key={row._id}>
              <td>{readable ? format(row.createdAt) : new Date(data.raw[0].createdAt).toDateString()}</td>
              <td className={`${getClass(row.description)}`}>{row.description}</td>
              <td>{row.alias}</td>
              <td>
                <span className="float-right">${(row.amount).toLocaleString('en-US')}</span>
              </td>
              <td colSpan="2">
                <span className="float-right">${(runningTotal(index).toLocaleString('en-US'))}</span>
              </td>
              {admin && <td><XSquare size={26} fill="#dc3545" onClick={() => remove(row._id)} style={{ cursor: 'pointer' }} /></td>}
            </tr>
          ))}
            <>
              <tr>
                <td><Button type="submit" variant="outline"><PlusSquare className="spin-on-hover" size={26} fill="#0069d9" /></Button></td>
                <td colSpan="2">
                  <Controller
                    render={({ field }) => <Form.Control {...field} placeholder="Description" />}
                    control={control}
                    name="description"
                    defaultValue=""
                  />
                </td>
                <td colSpan="3">
                  {errors.amount && <p className="text-danger p-0 m-0">Please enter to the closest dollar number only</p>}
                  <Controller
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control {...field} placeholder="Dollars"  />
                      </InputGroup>
                    )}
                    control={control}
                    name="amount"
                    defaultValue=""
                    required
                    rules={{
                      pattern: /^\d+$/
                    }}
                  />
                </td>
              </tr>
            </>
        </tbody>
      </Table>
    </Form>
  )
}