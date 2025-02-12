import React from 'react'
import './GridCell.css'

interface GridCellProps {
    text: string
}

const GridCell = ({text}: GridCellProps) => {
  return (
    <div className='gridcell'>{text}</div>
  )
}

export default React.memo(GridCell)