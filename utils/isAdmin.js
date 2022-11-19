const User = require("../models/user.model");
const { userTypes } = require("../utils/constants");

exports.isAdmin = async (req, res, next) => {
    const user = await User.findOne({
        userId: req.userId
    })
    if (user && user.userType == userTypes.admin) {
        next();
    } else {
        res.status(403).send({
            message: "Require Admin Role!"
        });
        return;
    }
};