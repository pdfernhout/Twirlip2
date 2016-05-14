To run the Twirlip / Thunderbird Server proof-of-concept:

1. compile the TypeScript source in client:

    source/webapp$ tsc

2. compile the TypeScript source in the server

    source/server$ tsc

3. use node.js to run the server

    source/server$ node js/twirlip_server.js

Then point your web browser to port 9000 of your local machine, using:

    http://localhost:9000/
    
Or:

    http://127.0.0.1:9000/
    
Or:

    http://YourMachineIP:9000
    
You may need to adjust your local machine's firewall
if you want to access this server from other devices on your network.
