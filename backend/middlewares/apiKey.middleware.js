function apiKeyMiddleware(req, res, next) {
    const providedApiKey = req.headers["x-api-key"];
    const providedToken = req.headers["access-token"];

    // Check for both API Key and Token
    if ((!providedApiKey || providedApiKey !== process.env.API_KEY) ||
        (!providedToken || providedToken !== process.env.ACCESS_TOKEN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
}

module.exports = apiKeyMiddleware;
