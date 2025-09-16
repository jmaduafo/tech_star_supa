import React from 'react'
import Kpi from './kpis/Kpi'
import Tables from './tables/Tables'
import Charts from './charts/Charts'

function MainPage() {
  return (
    <div className='flex flex-col gap-4'>
        <Kpi/>
        <Tables/>
        <Charts/>
    </div>
  )
}

export default MainPage