# BWRP-UI

The frontend-UI is the central entry point for domain experts to enter and update contract details and monitor usage data processing etc.

The UI is seperated into two components, a browser-based web frontend and a backend.
The fronend is based on the Vue framework and communicates directly with the backend.
While it provides basic functionality, it is extensible in a modular fashion.
The backend is based on nodeJS using the express framework.
It is responsible for user management and processing information retrieved from the frontend.
Furthermore, it is connected to the common adapter to, for instance, share contract data or sign contracts on the blockchain.

## Contributors

Our commitment to open source means that we are enabling -in fact encouraging- all interested parties to contribute and become part of its developer community.

## Licensing

Copyright (c) 2022 GSMA and all other contributors.

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this file except in compliance with the License.

You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](./LICENSE) for the specific language governing permissions and limitations under the License.
