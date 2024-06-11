import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar showSidebar={showSidebar} handleToggleSidebar={handleToggleSidebar} />
    </>
  )
}
