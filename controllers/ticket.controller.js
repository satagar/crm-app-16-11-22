const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const {userTypes, userStatus} = require('../utils/constants')
const objectConvertor = require('../utils/objectConvertor')

exports.createTicket = async (req,res) => {
    // validate title
    if(!req.body.title){
        return res.status(400).send({
            message: 'Title not found'
        })
    }

    // validate description
    if(!req.body.description){
        return res.status(400).send({
            message: 'Description not found'
        })
    }

    // rest of work
    var ticketObject = {
        reporter: req.userId,
        title: req.body.title,
        description: req.body.description,
        ticketPriority: req.body.ticketPriority,
        status: req.body.status,
    }
    let engineer;
    try{
        engineer = await User.findOne({
            userType: userTypes.engineer, //'ENGINEER',
            userStatus: 'APPROVED'
        });
    }
    catch(error){
        res.status(500).send({
            message: 'Internal error'
        })
    }
    

    ticketObject.assignee = engineer.userId;

    try {
        const ticket = await Ticket.create(ticketObject);

        if(ticket){
            const customer = await User.findOne({
                userId: req.userId
            });

            if(customer.ticketsCreated){
                customer.ticketsCreated.push(ticket._id);
            }
            else {
                customer.ticketsCreated = [ticket._id];
            }
            customer.save();
            if(engineer.ticketsAssigned){
                engineer.ticketsAssigned.push(ticket._id);
            }
            else {
                engineer.ticketsAssigned = [ticket._id];
            }
            engineer.save();

            res.status(201).send(objectConvertor.ticketConvertor(ticket));
        }
    } catch (error) {
        res.status(500).send({
            message: 'Error in creating ticket'
        });
    }
}