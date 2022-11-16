const authController = require('../controllers/auth.controller');
const verifySignup = require('../middlewares/signup.middleware');

module.exports = function(app){
    //verifySignup.validateSignupRequest
    app.post("/crm/api/v1/auth/signup", authController.signup);

    app.post("/crm/api/v1/auth/signin", authController.signin);
}

