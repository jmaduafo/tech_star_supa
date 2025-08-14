import React from 'react'

function Header2({ text, className }: { readonly text: string, readonly className?: string}) {
  return (
    <h2 className={`${className} leading-[1] text-[39px]`}>{text}</h2>
  )
}

export default Header2