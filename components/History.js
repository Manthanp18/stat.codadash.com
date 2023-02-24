import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { PlusSquare, XSquare, Calendar3, ArrowClockwise } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import DateInput from './DateInput'
import { rtf } from '../constants'
import "react-day-picker/dist/style.css"

export default function History({ data, mutate, session}) {
  const { register, handleSubmit, formState: { errors }, reset, setError, setValue } = useForm()
  const [readable, setReadable] = useState(false)
  const [recent, setRecent] = useState()
  const [showAll, setShowAll] = useState()
  const [admin, setAdmin] = useState()
  const [spin, setSpin] = useState()
  const [edit, setEdit] = useState()

  useEffect(() => setAdmin(session?.user.email === 'codabool@pm.me'), [session])

  useEffect(() =>  {
    if (!data?.raw) {
      setSpin(true)
      setTimeout(() => setSpin(false), 1000)
      return
    }
    const arr = data.raw.slice(0)
    const rec = arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (showAll) {
      setRecent(rec)
    } else {
      setRecent(rec.splice(0, 10))
    }
  }, [data, showAll])

  useEffect(() => {
    if (edit) {
      recent.forEach(row => {
        const descInput = document.querySelector(`#in-desc-${row._id}`)
        const amountInput = document.querySelector(`#in-amount-${row._id}`)
        descInput.value = row.description
        amountInput.value = row.amount
      })
    }
  }, [edit])

  function remove(id) {
    fetch(`/api/statement?${new URLSearchParams({id})}`,
      { method: 'DELETE' }
    )
      .then(() => mutate())
      .catch(err => {
        console.error(err.response.data.msg)
      })
  }

  function onSubmit(body) {
    if (!body.amount) {
      // TODO: setError
      setError("amount", {
        type: "manual",
        message: "No Amount Provided"
      })
      return
    }

    fetch('/api/statement', {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(() => mutate())
      .catch(console.err)
      .finally(() => reset({amount: '', description: ''}))
  }

  // function runningTotal(index) {
  //   let total = 0
  //   data.raw.forEach(doc => {
  //     total += doc.amount
  //   })
  //   for (let i = 0; i < index; i++) {
  //     total -= data.raw[i].amount
  //   }
  //   return total
  // }

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

  function changeEdit(e) {
    if (e.target.checked) {
      setEdit(true)
    } else {
      // submit
      const tr =  document.getElementsByTagName('tr')
      const arr = []
      
      for (const row of tr) {
        let obj = {data: {}, id: ''}
        for (const col of row.childNodes) {
          if (col.childNodes[0]?.tagName === 'INPUT') {
            const fullId = col.childNodes[0].id
            obj.id = fullId.split('-')[2]
            if (fullId.split('-')[1] === 'date') {
              obj.data.date = new Date(col.childNodes[0].value)
            } else if (fullId.split('-')[1] === 'amount') {
              obj.data.amount = col.childNodes[0].value
            } else {
              obj.data.desc = col.childNodes[0].value
            }
          }
        }
        if (obj.id) arr.push(obj)
      }

      fetch('/api/statement', {method: 'PUT', body: JSON.stringify(arr)})
        .then(() => mutate())
        .catch(console.error)
        .finally(() => setEdit(false))
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{overflow: 'auto'}}>
      <Form.Check 
        type="switch"
        label="Full History"
        className="mx-3 my-3"
        inline
        onChange={e => setShowAll(e.target.checked)}
      />
      <Form.Check 
        type="switch"
        label="Edit"
        inline
        className="mx-3 my-3"
        onChange={changeEdit}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th><Calendar3 size={26} className="sway-on-hover" onClick={() => setReadable(!readable)} style={{ cursor: 'pointer', width: '30px' }} /></th>
            <th colSpan="2" >Description</th>
            <th>By</th>
            <th>Amount</th>
            {/* <th>Total</th> */}
            <th  ><ArrowClockwise size={26} style={{width: '30px'}} className={`${spin && 'spin'} sway-on-hover`} onClick={mutate} fill="#0069d9" /></th>
            {admin && <th style={{width: '0', padding: '0'}}></th>}
          </tr>
        </thead>
        <tbody>
          {recent && !edit && 
            <>
              <tr>
                <td>
                  <DateInput register={register} setValue={setValue} />
                </td>
                <td colSpan="2">
                  <input
                    defaultValue=""
                    placeholder="Description"
                    className="form-control"
                    required
                    {...register("description")}
                  />
                </td>
                <td />
                <td>
                  {errors.amount && <p className="text-danger p-0 m-0">Please enter to the closest dollar number only</p>}
                  <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <input
                      defaultValue=""
                      placeholder="Dollars"
                      className="form-control"
                      required
                      {...register("amount", { pattern: /^\d+$/ })}
                    />
                  </InputGroup>
                </td>
                <td><Button type="submit" variant="outline" className="p-0 w-100"><PlusSquare className="spin-on-hover" size={26} fill="#0069d9" /></Button></td>
              </tr>
            </>
          }
          {recent && !edit && recent.map(row => (
            <tr key={row._id}>
              <td>{readable ? rtf(row.createdAt) : new Date(row.createdAt).toDateString()}</td>
              <td colSpan="2" className={`${getClass(row.description)}`}>{row.description}</td>
              <td>{row.alias}</td>
              <td>
                <span className="float-right">${(row.amount).toLocaleString('en-US')}</span>
              </td>
              {admin && <td><XSquare size={26} fill="#dc3545" className="p-0 w-100" onClick={() => remove(row._id)} style={{ cursor: 'pointer' }} /></td>}
            </tr>
          ))}
          {recent && edit && recent.map(row => (
            <tr key={row._id}>
              <td>
                <DateInput id={`in-date-${row._id}`} inDate={new Date(row.createdAt)} inDateFormat={new Intl.DateTimeFormat('en-US').format(new Date(row.createdAt))} />
              </td>
              <td colSpan="2"><input id={`in-desc-${row._id}`} className="form-control" /></td>
              <td>{row.alias}</td>
              <td><input type="number" id={`in-amount-${row._id}`} className="form-control" /></td>
              {admin && <td><XSquare size={26} fill="#dc3545" className="p-0 w-100" onClick={() => remove(row._id)} style={{ cursor: 'pointer' }} /></td>}
            </tr> 
          ))}
        </tbody>
      </Table>
    </Form>
  )
}