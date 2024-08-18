'use client';

import React, { useState, useEffect } from 'react';
import NavLink from './NavLink';
import { logOut } from '../utility/auth';
import { useRouter } from 'next/navigation';

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
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logOut(); 
      router.push('/login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const handleLogoClick = () => {
    router.push('/flashcards');
  }

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <img 
        src='/images/logo.png' 
        className='logo'
        onClick={handleLogoClick} 
        alt="Logo"
      />
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