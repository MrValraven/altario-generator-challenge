import React from 'react'
import Grid from './components/Grid/Grid'
import './Generator.css'

const Generator: React.FC = (): JSX.Element => {
  return (
    <div className='generator'>
        <h1>Generator</h1>
        <Grid></Grid>
    </div>
  )
}

export default Generator