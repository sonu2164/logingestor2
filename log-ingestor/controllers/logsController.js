// controllers/logsController.js
const Log = require('../models/Log');

const createLog = async (req, res) => {
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
};


const getLogs = async (req, res) => {
    const query = {};

    if (req.query.level) {
        query.level = req.query.level;
        console.log(req.query);
    }

    if (req.query.message) {
        query.message = { $regex: req.query.message, $options: 'i' };
    }

    if (req.query.resourceId) {
        query.resourceId = req.query.resourceId;
    }

    if (req.query.timestampStart && req.query.timestampEnd) {
        query.timestamp = {
            $gte: new Date(req.query.timestampStart),
            $lte: new Date(req.query.timestampEnd),
        };
    }

    if (req.query.traceId) {
        query.traceId = req.query.traceId;
    }

    if (req.query.spanId) {
        query.spanId = req.query.spanId;
    }

    if (req.query.commit) {
        query.commit = req.query.commit;
    }

    if (req.query.parentResourceId) {
        query['metadata.parentResourceId'] = req.query.parentResourceId;
    }

    try {
        const logs = await Log.find(query);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createLog,
    getLogs, // Add this line to export the getLogs function
};
