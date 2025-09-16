import CountCard from '@/components/ui/cards/CountCard'
import React from 'react'

function PendingCount() {
  return (
    <CountCard count={undefined} title={'Pending payment'}/>
  )
}

export default PendingCount