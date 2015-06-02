var router = require('express').Router();



router.get('/',function(req,resp){

    console.log(req)

    resp.end(req);
})


module.exports = router