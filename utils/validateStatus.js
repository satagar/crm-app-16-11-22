const { ticketStatus } = require('./constants');

exports.validateStatus = (req, res, next) => {
    const status = req.body.status;

    if ([ticketStatus.blocked, ticketStatus.closed, ticketStatus.inprogress, ticketStatus.open].includes(status)) {
        next();
    }
    else {
        return res.status(400).send({
            message: 'Invalid status value'
        })
    }
}