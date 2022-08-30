import {DefaultJitsuEvent} from "@jitsu/types/event";
import {DestinationFunction, DestinationMessage, JitsuDestinationContext} from "@jitsu/types/extension";

export type BentoDestinationConfig = {
    anonymous?: boolean,
    site_key: string,
    your_integration_name:string
}

export const JitsuBento: DestinationFunction<DefaultJitsuEvent, BentoDestinationConfig> =  (event: DefaultJitsuEvent, dstContext: JitsuDestinationContext<BentoDestinationConfig>) => {
    const context = event.eventn_ctx || event;
    const config = dstContext.config

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
    let envelops:DestinationMessage[] = [];

    // Remove JITSU fields
    if(context.JITSU_ENVELOP){
      delete context["JITSU_ENVELOP"];
    }
    if(context.__HTTP_CONTEXT__){
      delete context["__HTTP_CONTEXT__"];
    }

    if(config.anonymous){
      context.source_ip = "000.000.000.000"; // mask ip
      context.ids.ga = "undefined"; // mask ga
    }

    //on pageview
    if (eventType === "pageview") {
      context.name = eventType;

      // Add screen resolution
      var regex_firstDigits = /\d*/;
      if(typeof context.screen_resolution !== "undefined"){
        var m = context.screen_resolution.match(regex_firstDigits);
        if (m) {
            context.screen_width = m[0]
        }
      }

      envelops.push({
        url: "https://track.bentonow.com/webhooks/"+config.site_key+"/"+config.your_integration_name+"/track",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:context
      });
    }
    return envelops;
}
