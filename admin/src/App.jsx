import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div style={{fontFamily:'Inter, system-ui', maxWidth:980, margin:'0 auto', padding:'16px'}}>
      <header style={{display:'flex', gap:16, alignItems:'center', justifyContent:'space-between'}}>
        <h1>Admin • JEWELS</h1>
        <nav style={{display:'flex', gap:12}}>
          <Link to='/products'>Products</Link>
          <Link to='/login'>Login</Link>
        </nav>
      </header>
      <hr/>
      <Outlet/>
    </div>
  )
}
