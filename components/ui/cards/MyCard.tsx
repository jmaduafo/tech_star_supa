import React from 'react'

function Card({ children, className }: { readonly children: React.ReactNode, readonly className?: string}) {
  return (
    <section className={`p-6 rounded-2xl bg-card backdrop-blur-[150px] ${className}`}>
      {children}
    </section>
  )
}

export default Card