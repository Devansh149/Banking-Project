import 'dotenv/config'

import app from "./src/app.js"
import dns from 'dns'
import connectDB from './src/db/db.js'

dns.setServers(["1.1.1.1", "1.0.0.1"])

const startServer= async ()=>{
    await connectDB()
    
    app.listen(3000,()=>{
        console.log("Server is up!")
    })
}

startServer()