const User = require("../models/user.model");
const objectConvertor = require('../utils/objectConvertor')

exports.findAll = async (req, res) => {
    //Supporting the query param
    let userTypeReq = req.query.userType;
    let userStatusReq = req.query.userStatus;
    let nameReq = req.query.name;
    console.log(req.query)
    var users;
    if (nameReq) {
        try {
            users = await User.find({
                name: nameReq
            }).exec();
        } catch (err) {
            console.err("error while fetching the user for userName : ", userNameReq);
            res.status(500).send({
                message: "Some internal error occured"
            })
        }
    } else if (userTypeReq && userStatusReq) {
        try {
            users = await User.find({
                userType: userTypeReq,
                userStatus: userStatusReq
            }).exec();
        } catch (err) {
            console.err(`error while fetching the user for userType [${userTypeReq}] and userStatus [${userStatusReq}]`);
            res.status(500).send({
                message: "Some internal error occured"
            })
        }
    } else if (userTypeReq) {
 
        try {
            users = await User.find({
                userType: userTypeReq
            }).exec();
        } catch (err) {
            console.err(`error while fetching the user for userType [${userTypeReq}] `);
            res.status(500).send({
                message: "Some internal error occured"
            })
        }
    } else if (userStatusReq) {
 
        try {
            users = await User.find({
                userStatus: userStatusReq
            }).exec();
 
        } catch (err) {
            console.err(`error while fetching the user for userStatus [${userStatusReq}] `);
            res.status(500).send({
                message: "Some internal error occured"
            })
        }
    } else {
        try {
            users = await User.find().exec();
 
        } catch (err) {
            console.err(`error while fetching the users `);
            res.status(500).send({
                message: "Some internal error occured"
            })
        }
    }

    if (users) {
        res.status(200).send(objectConvertor.userResponse(users));
    } else {
        res.status(200).send({
            message: `User with this id [${userIdReq}] is not present`
        })
    }
}