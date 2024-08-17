'use client'; 

import React from 'react';
import NavLink from './NavLink';
import '../navbar.css';
import { useState, useEffect } from 'react';
import { logOut } from '../utility/auth';
import { useRouter } from 'next/navigation'; 
import "./navbar.css"

export default function Navbar() {
  const router = useRouter(); 
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) { 
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logOut(); 
      router.push('/login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }

  }

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <img src='/images/logo.png' className="logo" />
      <ul>
        <li><NavLink href="/flashcards" title="Flashcards" /></li>
        <li><NavLink href="/generate" title="Generate" /></li>
      </ul>
      <div>
        <a className='btn text-white' onClick={handleLogout}>Log out</a>
      </div>
    </nav>
  )
}