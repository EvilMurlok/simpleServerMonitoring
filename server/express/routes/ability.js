const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const abilityControllers = require("../controllers/ability");

const router = express.Router();

router.get(
    "/ability/retrieve-all-by-entity/",
    middlewaresAuth.checkNotAuthenticated,
    abilityControllers.retrieveAllByEntity
);

router.get(
    "/ability/retrieve-all-by-entity-action/",
    middlewaresAuth.checkNotAuthenticated,
    abilityControllers.retrieveAllByEntityAction
);

router.get(
    "/ability/retrieve-all-by-entity-detail/",
    middlewaresAuth.checkNotAuthenticated,
    abilityControllers.retrieveAllByEntityDetail
);

router.get(
    "/ability/retrieve-specific/",
    middlewaresAuth.checkNotAuthenticated,
    abilityControllers.retrieveSpecificOne
);


module.exports = router;
