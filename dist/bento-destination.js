'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const JitsuBento = (event, dstContext) => {
    const payload = event.eventn_ctx || event;
    const config = dstContext.config;
    function getEventType($) {
        switch ($.event_type) {
            case "bentonow":
                return "bentonow";
            default:
                return "bentonow"; // default
        }
    }
    const eventType = getEventType(event);
    let envelops = [];
    // Bentonow default event
    if (eventType === "bentonow") {
        // Remove JITSU properties
        if (payload.JITSU_ENVELOP) {
            delete payload["JITSU_ENVELOP"];
        }
        if (payload.__HTTP_CONTEXT__) {
            delete payload["__HTTP_CONTEXT__"];
        }
        // TODO: The anonymous logic could be better...
        if (config.anonymous) {
            payload.source_ip = "000.000.000.000"; // mask ip
            payload.email = "anonymous@anonymous.anonymous"; // mask email with an anonymous email (email is required by bentonow)
        }
        // Date
        if (payload.hasOwnProperty('timestamp')) {
            payload.date = payload.timestamp;
        }
        else if (!payload.hasOwnProperty('date')) {
            payload.date = new Date(Date.now());
        }
        // Email
        if (!payload.hasOwnProperty('email')) {
            payload.email = "undefined@undefined.undefined";
        }
        // Event type
        if (!payload.hasOwnProperty('type')) {
            payload.type = "undefined";
        }
        // Fields
        if (!payload.hasOwnProperty('fields')) {
            payload.fields = {};
        }
        // Details
        if (!payload.hasOwnProperty('details')) {
            payload.details = {};
        }
        envelops.push({
            url: "https://track.bentonow.com/webhooks/" + config.site_key + "/" + config.your_integration_name + "/track",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: payload
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

exports.buildInfo = {sdkVersion: "0.7.5", sdkPackage: "jitsu-cli", buildTimestamp: "2022-09-02T21:05:43.669Z"}