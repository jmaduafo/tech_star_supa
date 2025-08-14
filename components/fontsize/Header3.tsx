import React from 'react'

function Header3({ text, className }: { readonly text: string, readonly className?: string}) {
  return (
    <h3 className={`${className} leading-[1] text-[32px]`}>{text}</h3>
  )
}

export default Header3