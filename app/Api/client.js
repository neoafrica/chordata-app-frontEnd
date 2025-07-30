// import axios from "axios";
import axios from "axios";

// const client=axios.create({baseURL:'http://192.168.43.33:3000/api/post'}, {headers: {
//     Accept:'application/json',
//     'Content-Type': 'multipart/form-data',
//   }})

  const client=axios.create({baseURL:'https://chordata-backend-1.onrender.com/api/post'}, {headers: {
    Accept:'application/json',
    'Content-Type': 'multipart/form-data',
  }})



export default client;