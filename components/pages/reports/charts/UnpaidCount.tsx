import CountCard from '@/components/ui/cards/CountCard'
import React from 'react'

function UnpaidCount() {
  return (
    <CountCard count={undefined} title={'Unpaid payment'}/>
  )
}

export default UnpaidCount