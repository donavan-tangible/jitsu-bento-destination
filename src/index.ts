import {JitsuBento, BentoDestinationConfig} from "./bentonow-destination";
import {ConfigValidator, DestinationFunction, ExtensionDescriptor} from "@jitsu/types/extension";

const destination: DestinationFunction = JitsuBento

const validator: ConfigValidator<BentoDestinationConfig> = async (config) => {
    ['site_key', 'your_integration_name'].forEach(prop => {
        if (config[prop] === undefined) {
            throw new Error(`Required property '${prop}' is absent in config. Present props: ${Object.keys(config)}`);
        }
    })
    const urlEvent = "https://track.bentonow.com/webhooks/"+config.site_key+"/"+config.your_integration_name+"/track";
    let data = JSON.stringify({
        name: "Jitsu Config validator name test",
        domain: "validator.domain.test",
        url: "http://validator.domain.test/url"
    })
    let res = await fetch(urlEvent, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });

    if (res.headers?.get('Content-Type') === "application/json; charset=utf-8") {
        if (res.status === 201) {
            return {ok: true}
        } else {
            return {ok: false, message: `Response status:${res.status} from url:${urlEvent}`}
        }
    } else {
        return {ok: false, message: `Error Code: ${res.status} msg: ${await res.text()}`}
    }
}

const descriptor: ExtensionDescriptor<BentoDestinationConfig> = {
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
}

export {descriptor, destination, validator}
