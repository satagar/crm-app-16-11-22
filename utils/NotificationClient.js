const Client = require('node-rest-client').Client;

const client = new Client();

module.exports = (ticketId, subject, content, recipients, requestor) => {
    const requestBody = {
        subject,
        content,
        requester: requestor,
        recepientEmails: recipients,
        ticketId
    }

    const reqHeader = {
        "Content-Type": "application/json"
    }

    const args = {
        data: requestBody,
        headers: reqHeader
    }

    try {
        client.post(process.env.NOTIFICATIONSERVICE_URL, args, (data,res) => {
            console.log("Notificaiton request sent", data)
        })
    } catch (error) {
        console.log(error.message)
    }
}