export function usdPretty (price) {
  return (
    <h3 className="money">
      <span className="align-top" style={{lineHeight: '1.7em', fontSize: '0.6em'}}>$</span>
        {String(price).slice(0, -2)}
      <span className="d-inline align-top" style={{lineHeight: '1.6em', fontSize: '0.6em'}}>{String(price).slice(-2)}</span>
    </h3>
  )
}

// get year or month from timestamp
//   month = YOUR_TIMESTAMP.slice(5, 7).replace(/^0+/, '')
//   year = YOUR_TIMESTAMP.slice(0, 4)