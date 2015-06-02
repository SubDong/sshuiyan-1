/**
 * Created by weims on 2015/5/15.
 */
require(["angular", 'app', "router",
        "directive/publicdirective",
        "services/dateservice", "services/messageService", "services/popupService",
        "services/areaselect", "services/defaultQuotaService",
        "controller/wayctrl", "controller/tabsctrl"
    ],
    function (ng) {
        'use strict';

        ng.bootstrap(document, ["myApp"]);
    });