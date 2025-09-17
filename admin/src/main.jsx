import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Navigate to='/products'/>} />
        <Route path='login' element={<Login />} />
        <Route path='products' element={<Products />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
