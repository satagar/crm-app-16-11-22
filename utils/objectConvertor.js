exports.userResponse = (users) => {

    usersResult = [];
    users.forEach(user => {
        usersResult.push({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userTypes: user.userType,
            userStatus: user.userStatus
        });
    });
    return usersResult;

}