const express = require("express");
const path = require("path"); //
const app = express();
const port  = 3000;
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  })


app.use('/static', express.static('static'));
app.use(express.urlencoded()) 

app.set('view engine','ejs');   //TRIAL

app.get('/', (req,res)=>{
    // res.sendFile(__dirname + "/views/index.html"); 
    res.render(__dirname + "/views/index.ejs",{'Title':'Gym Website'});  //TRIAL
})


var once = 0    //used this var because broadcast emit happens everytime post method is used
app.post('/', (req,res)=>{
    xname = req.body.name 
    room = req.body.room //TRIAL
    // res.sendFile(__dirname + "/views/chat.html");
    res.render(__dirname + "/views/chat.ejs",{'roomname':room});  //TRIAL

    const users = {}
    if(once == 0){
    io.on('connection', socket =>{
        console.log("itsworkingtesttest")
        once = 1
        socket.join(room) //TRIAL
        console.log("New User", xname)
        users[socket.id]=xname
        console.log(socket.id)
        socket.broadcast.to(room).emit('user-joined',xname)
        

        socket.on('send', message=>{
            console.log("kuch bola", socket.id)
            socket.broadcast.to(room).emit('receive', {message: message, xname: users[socket.id]})
        })

        socket.on('disconnect', message=>{
            socket.broadcast.to(room).emit('left', users[socket.id])
            delete users[socket.id]
        })
    })
    }

})


app.listen(port, ()=>{
    console.log("Success")
})