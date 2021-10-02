const shortid = require('shortid')
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const UpdateStatusValidator = require('./validation/updateStatus');
const DeliveryController = require('./controllers/delivery');
const Db = require('./db');
app.use(bodyParser.json())

function serve() {
    app.get('/ohms/:id', async (req, res) => {
        // TODO need to check auth token and customer permissions
        const ohm = await DeliveryController.getOhmById(req.params.id);
        return res.send(ohm);
    })

    app.get('/logs', async (req, res) => {
        // TODO need to check auth token and customer permissions
        const logs = await Db.getLogs();
        return res.send(logs );
    })

    app.patch('/ohms/:id/status', async (req, res, next) => {
        // TODO need to check auth token and customer permissions
        try {
            // validate
            const { value, error } = UpdateStatusValidator.validate(req.body);
            if (error) {
                await Db.addLog('wrongValidation', { url: req.originalUrl, id: req.params.id })
                return res.status(422).json({ error: error });
            }
    
            // check if current delivery exist
            const ohm = await DeliveryController.getOhmById(req.params.id);
            if (!ohm) {
                await Db.addLog('deliveryNotFound', { url: req.originalUrl, id: req.params.id })
                return res.status(404).json({ error: 'Delivery not found'});
            }
    
            // try to update status
            const { status, isUpdated } = await DeliveryController.updateOhmStatusById(ohm, value.status);
    
            // worng status transition
            if (!isUpdated) {
                await Db.addLog('wrongStatus', {url: req.originalUrl, id: req.params.id, status: value.status })
                return res.status(422).json({ error: 'Wrong status' });
            }
    
            return res.send({ newStatus: status });
        } catch (e) {
            Db.addLog('error', e.message).catch(error => next(error));
            next(e);
        }
    })

    app.use(function (err, req, res, next) {
        console.error(`Error: `, err);
        console.error(`Request URL: `, req.originalUrl);
        return res.status(500).json({ error: 'Server error'});
    })

    app.listen(3000, () => console.log('listening on port 3000'));
}

function listenToProcessEvents() {
    process
        // Catch all errors
        .on('uncaughtException', (err, origin) => {
            // to make sure process will exit no meter what
			setTimeout(() => process.exit(1), 10000);
			console.error(`Uncaught Exception: ${err && err.message || 'no err'}`);
        })
        // Catch all Native Promise Unhandled Rejection.
        .on('unhandledRejection', (reason, promise) => {
            console.error(`Unhandled Rejection: ${reason}`);
        })
        // Log every exist
        .on('exit', (code) => {
            console.warn(`Process finished with exit code: ${code}`);
        });
}

serve();
listenToProcessEvents();