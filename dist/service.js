// TizenTuneIn - Service file for background operations
const express = require('express');
const cors = require('cors');
const app = express();

// Configure CORS
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Set up port
const PORT = 8086;

// Create a simple status endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        module: 'TizenTuneIn',
        version: '0.0.6'
    });
});



// Function to communicate with the TV's native capabilities
function setupTVInteractions() {
    // Check if Tizen APIs are available
    if (typeof tizen !== 'undefined') {
        console.log('Tizen APIs available, setting up TV interactions');

        // Register media keys
        window.addEventListener('load', function () {
            tizen.tvinputdevice.registerKey('MediaPlayPause');
            tizen.tvinputdevice.registerKey('MediaPlay');
            tizen.tvinputdevice.registerKey('MediaPause');
            tizen.tvinputdevice.registerKey('MediaStop');
            tizen.tvinputdevice.registerKey('MediaTrackNext');
            tizen.tvinputdevice.registerKey('MediaTrackPrevious');
            console.log('Successfully registered media keys');
        });
    } else {
        console.log('Tizen APIs not available, running in limited mode');
    }
    window.addEventListener('viewshow', updateKeys);
}

// Start the service
app.listen(PORT, () => {
    console.log(`TizenTuneIn service running on port ${PORT}`);
    setupTVInteractions();
});