const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const {userTypes, userStatus} = require('../utils/constants')
const objectConvertor = require('../utils/objectConvertor')
const sendEmail = require('../utils/NotificationClient');

exports.createTicket = async (req,res) => {

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

            /**
             * Send email on success
             */
            sendEmail(
                ticket._id, 
                `Ticket with id:${ticket._id} created`,
                ticket.description,
                [customer.email, engineer.email].toString(),
                'CRM app'
            )

            res.status(201).send(objectConvertor.ticketConvertor(ticket));
        }
    } catch (error) {
        res.status(500).send({
            message: 'Error in creating ticket'
        });
    }
}

exports.getAllTickets = async (req, res) => {
    let user;
    try {
        user = await User.findOne({userId: req.userId}).exec();
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }

    let queryObject = {};
    if(req.query.status){
        // Validate status value before setting it as filter
        queryObject.status = req.query.status
    }

    if(user.userType == 'ENGINEER'){
        queryObject.assignee = req.userId;
    }
    else if(user.userType == 'CUSTOMER'){
        queryObject.reporter = req.userId;
    }

    let tickets;
    try {
        tickets = await Ticket.find(queryObject).exec();
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }

    res.status(200).send(objectConvertor.ticketListConvertor(tickets));
}

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({
            _id: req.params.id
        }).exec();

        res.status(200).send(objectConvertor.ticketConvertor(ticket));
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }
}

exports.updateTicket = async(req, res) => {
    try {
        const ticket = await Ticket.findOne({_id:req.params.id}).exec();

        const user = await User.findOne({userId: req.userId}).exec();

        if(
            user.userType == "ADMIN" ||
            ticket.assignee == req.userId ||
            ticket.reporter == req.userId
        ){
            // Update ticket
            ticket.status = req.body.status != undefined ? req.body.status : ticket.status;

            const updatedTicket = await ticket.save();

            /**
             * Send email on success
             */
             sendEmail(
                ticket._id, 
                `Ticket with id:${ticket._id} created`,
                ticket.description,
                [ticket.reporter, engineer.assignee].toString(),
                'CRM app'
            )

            res.status(200).send(updatedTicket);
        }
        else {
            return res.status(401).send({
                message: 'User is not authorized for update to the ticket'
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        })
    }
}