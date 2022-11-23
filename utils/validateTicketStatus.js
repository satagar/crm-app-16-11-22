/**
 * This file will contain the middlewares for validating the ticket request body
 */
const constants = require("./constants");


validateTicketRequestBody = async (req, res, next) => {

    //Validating the userName
    if (!req.body.title) {
        res.status(400).send({
            message: "Failed! Title is not provided !"
        });
        return;
    }
    if (!req.body.description) {

        res.status(400).send({
            message: "Failed! Description is not provided !"
        });
        return;
    }

    next();


};


validateTicketStatus = async (req, res, next) => {
    //Validateing the user type
    const status = req.body.status;
    const statusTypes = [constants.ticketStatus.open, constants.ticketStatus.closed, constants.ticketStatus.inProgress, constants.ticketStatus.blocked]
    if (status && !statusTypes.includes(status)) {
        res.status(400).send({
            message: "status provided is invalid. Possible values CLOSED | BLOCKED | IN_PROGESS | OPEN "
        });
        return;
    }

    next();
}

const verifyTicketRequestBody = {
    validateTicketRequestBody: validateTicketRequestBody,
    validateTicketStatus: validateTicketStatus

};
module.exports = verifyTicketRequestBody


