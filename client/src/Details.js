import React from 'react'
import { useParams } from 'react-router-dom';


export default function Details() {
    const {id} = useParams();
    console.log(id);
    return (
        <div>
           <h2>your expected id : {id}</h2> 
        </div>
    )
}
