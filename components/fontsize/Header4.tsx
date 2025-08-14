import React from 'react'

function Header4({ text, className }: { readonly text: string, readonly className?: string}) {
  return (
    <h4 className={`${className} leading-[1] text-[22px]`}>{text}</h4>
  )
}

export default Header4