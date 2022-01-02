const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const url = process.env.DataBaseUrl;
const cors = require('cors');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//server
app.use(cors());
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//database
mongoose.connect(url);

//routes
require('./routes/userRoutes')(app);
require('./routes/challengeRoutes')(app);
require('./routes/teamRoutes')(app);
require('./routes/matchRoutes')(app);
require('./routes/storyRoutes')(app);
require('./routes/skillsRoutes')(app);
require('./routes/matchVoteRoutes')(app);
require('./routes/matchActionRoutes')(app);
require('./routes/getRessource')(app);
require('./routes/notificationRoutes')(app);
require('./routes/transactionRoutes')(app);
require('./routes/history_teamRoutes')(app);

/*
require('./routes/notificationRoutes')(app);
require('./routes/terrainRoutes')(app);
require('./routes/availabilityRoutes')(app);
*/
