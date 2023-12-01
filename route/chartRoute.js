const route = require('express').Router()
const chartController = require('../controller/chartController');


route.post("/allusers/:id", chartController.getAllUsers);
route.post("/addmsg", chartController.addMessage);
route.post("/getmsg", chartController.getMessages);

module.exports = route