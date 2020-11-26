# BWRP-UI

The frontend-UI is the central entry point for domain experts to enter and update contract details and monitor usage data processing etc.

The UI is seperated into two components, a browser-based web frontend and a backend.
The fronend is based on the Vue framework and communicates directly with the backend.
While it provides basic functionality, it is extensible in a modular fashion.
The backend is based on nodeJS using the express framework.
It is responsible for user management and processing information retrieved from the frontend.
Furthermore, it is connected to the common adapter to, for instance, share contract data or sign contracts on the blockchain.
