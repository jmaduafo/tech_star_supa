import Header6 from '@/components/fontsize/Header6';
import Paragraph from '@/components/fontsize/Paragraph';
import React from 'react'

function PieChartHeading({
  text,
  subtext,
  className,
}: {
  readonly text: string;
  readonly subtext: string;
  readonly className?: string;
}) {
  return (
    <div className={`${className}`}>
      <Header6 text={text} className='text-center'/>
      <Paragraph text={subtext} className="text-center text-lightText/70 mt-0.5" />
    </div>
  )
}

export default PieChartHeading