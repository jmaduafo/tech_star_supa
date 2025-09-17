import React from 'react'

function Card({ children, className }: { readonly children: React.ReactNode, readonly className?: string}) {
  return (
    <section className={`p-6 rounded-[20px] bg-light15 backdrop-blur-[150px] ${className}`}>
      {children}
    </section>
  )
}

export default Card