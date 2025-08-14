import React from 'react'

function Input({children, label, htmlFor, className}: {readonly htmlFor: string; readonly label: string; readonly children: React.ReactNode; readonly className?: string}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )
}

export default Input