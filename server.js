const express = require("express")
const mongoos = require("mongoose")
const process = require("process")
const app = express()
const { fetch_setting } = require("./utils")

const PORT = fetch_setting({key: "port", _default: 8080})
const CONNECTION_STR = fetch_setting({key: "database"})

const userRouter = require("./controllers/userController")
const exp = require("constants")

app.use(express.json())
app.use("/api/user", userRouter)

mongoos.connect(CONNECTION_STR, (err)=>{
    if(err){
        console.error("Cannot connect to database: ", err)
        shutdown()
        return
    }
    console.info("Database is ready")
})
const db = mongoos.connection

const server = app.listen(PORT, "0.0.0.0", ()=>{
    console.info("Server is running on port ", PORT)    
})

const shutdown = () => {
    console.info("Shutting down the server gracefully")
    server.close(()=>{
        console.info("HTTP server closed")
    })
    db.close((err)=>{
        if(err){
            console.error("Cannot close the database: ", err)
            return
        }
        console.info("Database is closed")
    })
}

process.on("SIGTERM", shutdown)