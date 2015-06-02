/**
 * Created by yousheng on 15/6/2.
 */
var app = require('express')(),
    path = require('path'),
    t = require('./track/index');



app.use('/t.js',t)


app.listen(8000)

