const route = require('express').Router()

route.get("/allusers/:id", getAllUsers);
route.post("/addmsg", addMessage);
route.post("/getmsg", getMessages);

module.exports = route