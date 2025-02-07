"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.use((req, res, next) => {
        // Not found
        res.status(404).json({ message: "This route does not exist" });
    });
    app.use((err, req, res, next) => {
        // always logs the next(err)
        console.error("ERROR", req.method, req.path, err);
        // only render if the error ocurred before sending the response
        if (!res.headersSent) {
            res
                .status(500)
                .json({
                message: "Internal server error. Check the server console",
            });
        }
    });
};
