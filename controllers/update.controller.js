const User = require("../models/user.model");

exports.update = async (req, res) => {
    const userIdReq = req.params.userId;
    try {
        const user = await User.findOneAndUpdate({
            userId: userIdReq
        }, {
            userName: req.body.userName,
            userStatus: req.body.userStatus,
            userType: req.body.userType
        }).exec();
        res.status(200).send({
            message: `User record has been updated successfully`
        });
    } catch (err) {
        console.err("Error while updating the record", err.message);
        res.status(500).send({
            message: "Some internal error occured"
        })
    };
}