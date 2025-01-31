import React from 'react'
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie';

const sessionCookie = Cookies.get('sessionId');
console.log(sessionCookie);

const Navbar = () => {
  return (
    <nav className="flex justify-around bg-amber-900 p-4">
      <NavLink
        to="/chat"
        className={({ isActive }) => `
          font-serif text-amber-50 px-4 py-2 rounded-lg 
          hover:bg-amber-800 transition duration-300
          ${isActive ? 'bg-amber-800' : ''}
        `}
      >
        Home
      </NavLink>
      
      <NavLink
        to="/stories"
        className={({ isActive }) => `
          font-serif text-amber-50 px-4 py-2 rounded-lg 
          hover:bg-amber-800 transition duration-300
          ${isActive ? 'bg-amber-800' : ''}
        `}
      >
        Your Stories
      </NavLink>
      
      <NavLink
        to="/story-filter"
        className={({ isActive }) => `
          font-serif text-amber-50 px-4 py-2 rounded-lg 
          hover:bg-amber-800 transition duration-300
          ${isActive ? 'bg-amber-800' : ''}
        `}
      >
        Filter Stories
      </NavLink>
      
      <NavLink
        to="/logout"
        className={({ isActive }) => `
          font-serif text-amber-50 px-4 py-2 rounded-lg 
          hover:bg-amber-800 transition duration-300
          ${isActive ? 'bg-amber-800' : ''}
        `}
      >
        Sign Out
      </NavLink>
    </nav>
  )
}

export default Navbar