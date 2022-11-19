const authController = require('../controllers/auth.controller');
const verifySignup = require('../middlewares/signup.middleware');
const findAllController = require('../controllers/findAll.controller');
const findByIdController = require('../controllers/findById.controller');
const updateController = require('../controllers/update.controller');
const validator = require('../utils/validateToken');
const {isAdmin} = require('../utils/isAdmin');

module.exports = function(router){
    //verifySignup.validateSignupRequest
    router.use((req, res, next) => {
        console.log(req.query)
        next()
    })
    router.post("/crm/api/v1/auth/signup", authController.signup);

    router.post("/crm/api/v1/auth/signin", authController.signin);

    // crm/api/v1/users?userType=CUSTOMER&userStatus=APPROVED&name=Test
    router.get("/crm/api/v1/users", validator.verifyToken, isAdmin, findAllController.findAll);

    router.get("/crm/api/v1/users/:userId", validator.verifyToken, isAdmin, findByIdController.findById);

    router.put("/crm/api/v1/users/:userId", validator.verifyToken, isAdmin, updateController.update);

}

