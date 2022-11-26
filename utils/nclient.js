const Client = require('node-rest-client').Client;

const client = new Client();

exports.sendEmail = (payload) => {
    const args = {
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            "subject": payload.subject,
            "content": payload.content,
            "recepientEmails": payload.recipients,
            "requester": payload.requester,
            "ticketId": payload.ticketId
        }
    }
    client.post('http://localhost:3000/notifiServ/api/v1/notifications', args, (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    })
}