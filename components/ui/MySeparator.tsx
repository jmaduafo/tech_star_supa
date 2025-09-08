import React from 'react'

function Separator({ className }: { readonly className?: string}) {
  return (
    <div className={`h-[1px] bg-light20 w-full ${className}`}></div>
  )
}

export default Separator