'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const JitsuBento = (event, dstContext) => {
    const context = event.eventn_ctx || event;
    const config = dstContext.config;
    function getEventType($) {
        switch ($.event_type) {
            case "pageview":
                return "pageview";
            //case "user_identify":
            //case "identify":
            //    return "$identify";
            //case "page":
            //case "site_page":
            //    return "site_page";
            default:
                return $.event_type;
        }
    }
    const eventType = getEventType(event);
    let envelops = [];
    // Remove JITSU fields
    if (context.JITSU_ENVELOP) {
        delete context["JITSU_ENVELOP"];
    }
    if (context.__HTTP_CONTEXT__) {
        delete context["__HTTP_CONTEXT__"];
    }
    if (config.anonymous) {
        context.source_ip = "000.000.000.000"; // mask ip
        context.ids.ga = "undefined"; // mask ga
    }
    //on pageview
    if (eventType === "pageview") {
        context.name = eventType;
        // Add screen resolution
        var regex_firstDigits = /\d*/;
        if (typeof context.screen_resolution !== "undefined") {
            var m = context.screen_resolution.match(regex_firstDigits);
            if (m) {
                context.screen_width = m[0];
            }
        }
        envelops.push({
            url: "https://track.bentonow.com/webhooks/" + config.site_key + "/" + config.your_integration_name + "/track",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: context
        });
    }
    return envelops;
};

const destination = JitsuBento;
const validator = async (config) => {
    ['site_key', 'your_integration_name'].forEach(prop => {
        if (config[prop] === undefined) {
            throw new Error(`Required property '${prop}' is absent in config. Present props: ${Object.keys(config)}`);
        }
    });
    const urlEvent = "https://track.bentonow.com/webhooks/" + config.site_key + "/" + config.your_integration_name + "/track";
    let data = JSON.stringify({
        name: "Jitsu Config validator name test",
        domain: "validator.domain.test",
        url: "http://validator.domain.test/url"
    });
    let res = await fetch(urlEvent, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });
    if (res.headers?.get('Content-Type') === "application/json; charset=utf-8") {
        if (res.status === 201) {
            return { ok: true };
        }
        else {
            return { ok: false, message: `Response status:${res.status} from url:${urlEvent}` };
        }
    }
    else {
        return { ok: false, message: `Error Code: ${res.status} msg: ${await res.text()}` };
    }
};
const descriptor = {
    id: "jitsu-bento-destination",
    displayName: "bento",
    icon: "",
    description: "Jitsu can send events from JS SDK or Events API to Bento API filling as much Bento Events " +
        "Properties as possible from original event data.",
    configurationParameters: [
        {
            id: "anonymous",
            type: "boolean",
            required: false,
            displayName: "Send anonymous data",
            documentation: "Send anonymous data to Plausbile if true or all data including user data if false.",
        },
        {
            id: "site_key",
            type: "string",
            required: true,
            displayName: "Bento Site Key/UUID",
            documentation: "Bento Site Key/UUID",
        },
        {
            id: "your_integration_name",
            type: "string",
            required: true,
            displayName: "Your integration name configured in Bento",
            documentation: "Your integration name configured in Bento",
        }
    ],
};

exports.descriptor = descriptor;
exports.destination = destination;
exports.validator = validator;

exports.buildInfo = {sdkVersion: "0.7.5", sdkPackage: "jitsu-cli", buildTimestamp: "2022-09-01T17:51:49.939Z"}