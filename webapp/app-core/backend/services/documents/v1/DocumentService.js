"use strict";

const config = require("config");
const Enums = require(global.GLOBAL_BACKEND_ROOT + "/Enums");
const ErrorCodes = require(global.GLOBAL_BACKEND_ROOT + "/ErrorCodes");
const AbstractService = require(global.GLOBAL_BACKEND_ROOT + "/services/AbstractService");
const ensureAuthenticated = require(global.GLOBAL_BACKEND_ROOT + "/libs/middlewares").ensureAuthenticated;

class DocumentService extends AbstractService {
    constructor(serviceName, serviceConfig, app, database) {
        super(serviceName, serviceConfig, app, database);
        this.requiredAdapterType("blockchain");
        this.requiredAdapterType("localStorage");
        this.registerRequestHandler();
        this.mspid = config.organization.mspid;
    }

    registerRequestHandler() {
        /**
         * curl -X GET http://{host}:{port}/api/v1/documents
         * curl -X GET http://{host}:{port}/api/v1/documents?type=contract
         * curl -X GET http://{host}:{port}/api/v1/documents?type=contract&state=sent
         */
        this.getRouter().get("/", ensureAuthenticated, async (req, res) => {
            const type = req.query.type;
            const state = req.query.state;
            try {
                const response = await this.getBackendAdapter("localStorage").getDocuments(type, state);
                return res.json(response);
            } catch (error) {
                this.handleError(res, new Error(JSON.stringify({
                    code: ErrorCodes.ERR_PRIVATE_DATA,
                    message: "Failed to get private documents"
                })), 'GET /');
            }
        });

        /**
         * curl -X GET http://{host}:{port}/api/v1/documents/{documentId}
         */
        this.getRouter().get("/:documentId", ensureAuthenticated, async (req, res) => {
                const documentId = req.params.documentId;
                try {
                    const response = await this.getBackendAdapter("localStorage").getDocument(documentId);
                    return res.json(response);
                } catch (error) {
                    this.handleError(res, new Error(JSON.stringify({
                        code: ErrorCodes.ERR_PRIVATE_DATA,
                        message: "Failed to get document",
                    })), 'GET /:documentId');
                }
            }
        );

        /**
         *  curl -X POST http://{host}:{port}/api/v1/documents -d '{"type":"contract", "toMSP":"TMUS","data":{...}}' -H "Content-Type: application/json"
         */
        this.getRouter().post("/", ensureAuthenticated, async (req, res) => {
            try {
                const type = req.body.type;
                const toMSP = req.body.toMSP;
                const data = req.body.data;
                let documentData = {
                    header: { version: "1.0", type: type, msps: {} },
                    body: data,
                };
                documentData.header.msps[this.mspid] = { minSignatures: 2 };
                documentData.header.msps[toMSP] = { minSignatures: 2 };
                documentData = JSON.stringify(documentData);
                documentData = documentData.replace(/\s/g, "");

                const documentDataBase64 = new Buffer.from(documentData).toString("base64");
                const response = await this.getBackendAdapter("blockchain").uploadPrivateDocument(toMSP, documentDataBase64);
                const documentId = response.documentID;
                documentData = {
                    "type": type,
                    "fromMSP": this.mspid,
                    "toMSP": toMSP,
                    "data": documentData,
                    "state": Enums.documentState.PENDING
                }
                await this.getBackendAdapter("localStorage").storeDocument(documentId, documentData);
                return res.json(response);
            } catch (error) {
                this.getLogger().error("[DocumentService::/] Failed to store document - %s", error.message);
                this.handleError(res, new Error(JSON.stringify({
                    code: ErrorCodes.ERR_PRIVATE_DATA,
                    message: "Failed to store document",
                })), 'POST /');
            }
        });

        /**
         * curl -X POST http://{host}:{port}/api/v1/documents/event -d '{...}'
         */
        this.getRouter().post("/event", async (req /*, res*/) => {
            this.getLogger().debug("[DocumentService::/event] %s", JSON.stringify(req.body));
            const body = req.body;
            if (body && body.data && body.data.documentID) {
                const documentId = body.data.documentID;
                try {
                    const documentData = await this.getBackendAdapter("blockchain").getPrivateDocument(documentId);
                    // fromMSP, toMSP, data, dataHash, timeStamp
                    if (documentData) {
                        if (await this.getBackendAdapter("localStorage").existsDocument(documentId)) {
                            const data = {
                                state: Enums.documentState.SENT
                            }
                            await this.getBackendAdapter("localStorage").updateDocument(documentId, data);
                        } else {
                            // TODO !!!
                            const data = {
                                state: Enums.documentState.SENT
                            }
                            await this.getBackendAdapter("localStorage").storeDocument(documentId, data);
                        }
                        this.getLogger().info("[DocumentService::/event] Stored document with id %s successfully", documentId);
                    } else {
                        this.getLogger().error("[DocumentService::/event] Failed to get document with id - %s", documentId);
                    }
                } catch (error) {
                    this.getLogger().error("[DocumentService::/event] Failed to store document - %s", error.message);
                }
            }
        });
    }
}

module.exports = DocumentService;
