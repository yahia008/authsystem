const jwt = require('jsonwebtoken');


const authUser = (req, res, next) => {
    try {

        if (!req.headers.authorization) {
            throw new Error('Authorization header missing');
        }

        const token = req.headers.authorization.split(' ')[1];
        
        // Verify the token
        const decodedToken = jwt.verify(token, 'secretKey');
        
        // Attach the user ID to the request object
        req.userId = decodedToken.userId;
        
        next();
      } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized' });
      }
    };
    
 module.exports = {
        authUser
    }