import React from 'react'

function Header6({ text, className }: { readonly text: string, readonly className?: string}) {
  return (
    <h6 className={`${className} leading-[1.3] text-[14px] sm:text-[16px]`}>{text}</h6>
  )
}

export default Header6