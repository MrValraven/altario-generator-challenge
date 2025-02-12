import React, { useEffect, useState } from 'react'
import GridCell from '../GridCell/GridCell'
import './Grid.css'

const Grid = () => {
    const [gridData, setGridData] = useState([[]])

    useEffect(() => {
        const getGridData = async () => {
            const response = await fetch('http://localhost:8000/grid');

            if(!response.ok) {
                console.log('error fetching grid')
            }

            const data = await response.json();
            console.log(data)
            setGridData(data.grid);
        }

        const twoSecondInterval = setInterval(async() => {
            await getGridData();
        }, 2000)

        return () => {
            clearInterval(twoSecondInterval)
          }
    }, [])
    
    
  return (
    <div className='grid-container'>
        <h2>Grid</h2>
        {gridData?.map((row, rowIndex) => 
            <div key={`row${rowIndex}`} className="grid-row">
                {row?.map((gridCell, columnIndex) =>
                    <GridCell key={`row${rowIndex}column${columnIndex}`} text={gridCell}/>
                )   }
            </div>
    )}
    </div>
  )
}

export default Grid