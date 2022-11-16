const User = require("../models/user.model");
const { userTypes } = require("../utils/constants");
const constants = require("../utils/constants");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.signup = async (req, res) => {
    // Default approve signup request for customer
    var userStatus = req.body.userStatus;
    if (!req.body.userStatus) {
        if (!req.body.userType || req.body.userType == userTypes.customer) {
            userStatus = constants.userStatus.approved;
        } else {
            userStatus = constants.userStatus.pending;
        }
    }

    // Create user object to save in mongoDB
    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType:
            req.body.userType,
        password:
            bcrypt.hashSync(req.body.password,
                8),
        userStatus: userStatus
    }
    console.log('post bcrypt')
    // Call mongodb and save the new user
    try {
        const userCreated = await User.create(userObj);
        console.log('post create')
        const postResponse = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userTypes: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        }
        // Created success status code: 201
        res.status(201).send(postResponse);
    } catch (err) {
        console.log("Some error while saving the user in db", err.message);
        res.status(500).send({
            message: "Some internal error while inserting the element"
        });
    }
}

exports.signin = async (req, res) => {
    const user = await User.findOne({ userId: req.body.userId });
    console.log(user);
    if (user == null) {
        // Client error: 400
        res.status(400).send({
            message: "Failed! Userid doesn't exist!"
        });
        return;
    }
    if (user.userStatus != 'APPROVED') {
        res.status(200).send({
            message: `Can't allow login as user is in statuts : [${user.userStatus}]`
        })
        return;
    }

    var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
    );
    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
        });
    }
    var token = jwt.sign({ id: user.userId }, config.secret, {
        expiresIn: 86400 //24 hrs
    });
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userTypes: user.userType,
        userStatus: user.userStatus,
        accessToken: token
    });
}