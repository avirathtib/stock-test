import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from "./App"
import {db} from "./firebase"


function Profile() {
    const {email, setEmail} = useContext(UserContext);
    const [name, setName] = useState("");

    useEffect(() => {
        console.log("wtf");
        getUserByEmail(email);
      });

    async function getUserByEmail(email) {
        console.log("query start")
        const query = await db.collection('users').where('email', '==', email).get();
        console.log(query)
        if(!query.empty) {
            const snapshot = query.docs[0];
            const data = snapshot.data();
            console.log(data.name);
            setName(data.name);

        } else {
            console.log("Error")
        }
    }

   
    return (
        <div>
            {console.log(email)}
            <p>email : {email}</p>
            <p>{name}</p>
            
            
        </div>
    )
}

export default Profile
