import {destination} from "../src";
import {JitsuDestinationContext} from "@jitsu/types/extension";
import {testDestination} from "jitsu-cli/lib/tests";
import {BentoDestinationConfig} from "../src/bentonow-destination";

 //
 // You can test destination here
 // site_key
 // your_integration_name variable
 //
const testContext: JitsuDestinationContext<BentoDestinationConfig> = {
    destinationId: "abc123",
    destinationType: "bentonow",
    config: {
        anonymous: true,
        site_key: "UUID",
        your_integration_name: "jitsu"
    },
}

let datenow = new Date(Date.now())

testDestination({
    name: "bentonow_fault_event",
    context: testContext,
    destination: destination,
    event: {
        event_type: "bentonow",
        eventn_ctx: {
            email: "test",
            type: "test",
            fields: "test",
            details: "test",
            date: datenow
        }
    },
    expectedResult: [
        {
            "body": {
                "date": datenow,
                "details": "test",
                "email": "anonymous@anonymous.anonymous",
                "fields": "test",
                "source_ip": "000.000.000.000",
                "type": "test",
            },
            "headers": {
                "Content-Type": "application/json",
            },
            "method": "POST",
            "url": "https://track.bentonow.com/webhooks/"+testContext.config.site_key+"/"+testContext.config.your_integration_name+"/track",
        }
    ]
    }
)
