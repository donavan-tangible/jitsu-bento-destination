import {destination} from "../src";
import {JitsuDestinationContext} from "@jitsu/types/extension";
import {testDestination} from "jitsu-cli/lib/tests";
import {BentoDestinationConfig} from "../src/bento-destination";

/**
 * Represents context data of configured destination instance
 */
const testContext: JitsuDestinationContext<BentoDestinationConfig> = {
    destinationId: "abc123",
    destinationType: "bento",
    config: {
        anonymous: true,
        site_key: "1100InvalidUUID",
        your_integration_name: "jitsu"
    }
}

testDestination({
    name: "pageview",
    context: testContext,
    destination: destination,
    event: {
        event_type: "pageview",
        name: "pageview",
        domain: "testbento.tangible.one",
        url: "https://testbento.tangible.one/"
    },
    expectedResult: [
        {
            "body": JSON.stringify(
                {
                    success: true
                }
            ),
            "headers": {
                "Content-Type": "application/json",
            },
            "method": "POST",
            "url": "https://testbento.tangible.one/",
        }
    ]
    }
)
