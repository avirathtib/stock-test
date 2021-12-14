import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from "./App"
import {db} from "./firebase"
import { useParams } from "react-router-dom";


function LeaguePage() {
    
    const [playersInLeague, setPlayersInLeague] = useState([]);
    const { leagueName } = useParams();

    useEffect(() => {
        getPlayers();
      },[]);

    let temporaryPlayers = [];
    
     function getPlayers() {
      temporaryPlayers = db.collection("leagues").doc(leagueName).collection("players").get().then(function(querySnapshot) {
        temporaryPlayers = querySnapshot.docs
        .map((doc) => doc.data())
        .map((data) => {
          console.log(data.name);
          return {name: data.name, id: data.id}
        })
        setPlayersInLeague(temporaryPlayers);
      })      
    }
  

   
    return (
        <div>
            <h3>Players in {leagueName} :</h3>
            {playersInLeague.map((player) => {
              return (
                <li>
                {player.name}
                </li>
              )
            })}
            
        </div>
    )
}

export default LeaguePage
