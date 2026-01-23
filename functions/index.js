"use strict";
// Azure Functions entry point
// Import all function handlers to register them with the runtime
Object.defineProperty(exports, "__esModule", { value: true });
require("./cities/index");
require("./cities-by-id/index");
require("./countries/index");
require("./countries-by-id/index");
require("./routes/index");
require("./routes-by-id/index");
require("./routes-send-link/index");
require("./default-trips/index");
require("./default-trips-by-id/index");
require("./trip-templates/index");
require("./trip-templates-by-id/index");
require("./route-cards/index");
require("./route-cards-by-id/index");
require("./leads/index");
require("./leads-by-id/index");
require("./images-search/index");
require("./images-generate/index");
require("./upload-image/index");
require("./compress-image/index");
require("./list-images/index");
require("./migrate-images/index");
