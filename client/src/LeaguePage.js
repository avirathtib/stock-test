import React from 'react'
import { useParams } from "react-router-dom";

function LeaguePage() {
    const { id } = useParams();
    return (
        <div>
            <p>league name : {id} </p>
        </div>
    )
}

export default LeaguePage
