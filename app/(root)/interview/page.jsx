import Agent from '@/components/Agent'
import { getServerUser} from '@/lib/config/server_actions';
import React from 'react';


const page = async() =>{

  const user = await getServerUser();
  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName={user?.name} userId={user?._id.toString()} type="generate" />
    </>
  )
}

export default page
/*
{
    "success": true,
    "data": {
        "_id": "68034d501eb9183ce1b649c5",
        "name": "aman",
        "email": "aman@gmail.com",
        "password": "$2b$10$GuNI0zYDJq6oT7dn9UDu7ufnFbnY2Ynvptq4sf3zJd3cShKzaj3M2",
        "date": "2025-04-19T07:14:24.048Z",
        "__v": 0
    }
}
*/