const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
// const logsRoutes = require('./routes/logsRoutes');
const Log = require('./models/Log');
const authenticate = require('./middlewares/authenticate');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const mongoUrl = 'mongodb://localhost:27017/logsdb';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.locals.db = db;

// app.use('/api', logsRoutes);
app.get("/", (req, res) => {
    res.send('<h1>sonu singh</h1>'); // Corrected this line
});
app.post('/', async (req, res) => {
    try {
        // Assuming your Log model has a 'timestamp' field
        const log = new Log({
            ...req.body,
            timestamp: new Date() // Set the timestamp to the current date and time
        });

        await log.save();
        console.log('Log inserted into MongoDB');
        res.status(200).json({ _id: log._id });
    } catch (error) {
        console.error('Error inserting log into MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/api", async (req, res) => {
    const query = {};
    console.log(req.query);


    if (req.query.level) {
        query.level = req.query.level;

    }

    if (req.query.message) {
        query.message = { $regex: req.query.message, $options: 'i' };
    }

    if (req.query.resourceid) {
        query.resourceId = req.query.resourceid;
    }

    if (req.query.timestamp && req.query.timestamp2) {
        query.timestamp = {
            $gte: new Date(req.query.timestamp),
            $lte: new Date(req.query.timestamp2),
        };
    }

    if (req.query.traceid) {
        query.traceId = req.query.traceid;

    }

    if (req.query.spanid) {
        query.spanId = req.query.spanid;
    }

    if (req.query.commit) {
        query.commit = req.query.commit;
    }

    if (req.query.parentResourceid) {
        query['metadata.parentResourceid'] = req.query.parentResourceId;
    }

    try {
        const logs = await Log.find(query);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post("/auth/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, password, role: 'user' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'sonu1234',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
app.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'sonu1234',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get("/user-details", authenticate, (req, res) => {
    // The user details are available in req.user (from the token)
    res.json({ user: req.user });
});

// app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Log Ingestor listening at http://localhost:${port}`);
});
