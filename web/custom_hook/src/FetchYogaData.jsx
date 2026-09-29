import React from 'react'
import useFetch from './UseFetch'
import './FetchData.css'
 const FetchData = () => {
    const [data]=useFetch('https://api.npoint.io/4459a9a10e43812e1152');
    console.log(data);
  return (
   <>
      <h1 className='useFetch_heading'>Use Fetch Custom Hook</h1>
   <ul className='list_data_main'>
    {data && data.map((e,index)=>(
        <li key={index} className='list_data_main'>
            <h3>{e.name}</h3>
            <p><strong>Benefits: </strong>{e.benefits}</p>
            <p><strong>Duration: </strong>{e.time_duration}</p>
            </li>
    ))}
   </ul>
   </>
  )
}
export default  FetchData
