import {DefaultJitsuEvent} from "@jitsu/types/event";
import {DestinationFunction, DestinationMessage, JitsuDestinationContext} from "@jitsu/types/extension";

export type BentoDestinationConfig = {
    anonymous?: boolean,
    site_key: string,
    your_integration_name:string
}

export const JitsuBento: DestinationFunction<DefaultJitsuEvent, BentoDestinationConfig> =  (event: DefaultJitsuEvent, dstContext: JitsuDestinationContext<BentoDestinationConfig>) => {
    const payload = event.eventn_ctx || event;
    const config = dstContext.config

    function getEventType($) {
        switch ($.event_type) {
            case "bentonow":
                return "bentonow";
            default:
                return "bentonow"; // default
        }
    }

    const eventType = getEventType(event);
    let envelops:DestinationMessage[] = [];

    // Bentonow default event
    if (eventType === "bentonow") {
      // Remove JITSU properties
      if(payload.JITSU_ENVELOP){
        delete payload["JITSU_ENVELOP"];
      }
      if(payload.__HTTP_CONTEXT__){
        delete payload["__HTTP_CONTEXT__"];
      }

      // TODO: The anonymous logic could be better...
      if(config.anonymous){
        payload.source_ip = "000.000.000.000"; // mask ip
        payload.email = "anonymous@anonymous.anonymous"; // mask email with an anonymous email (email is required by bentonow)
      }

      // Date
      if(payload.hasOwnProperty('timestamp')){
          payload.date = payload.timestamp
      }else if(!payload.hasOwnProperty('date')){
          payload.date = new Date(Date.now())
      }

      // Email
      if(!payload.hasOwnProperty('email')){
          payload.email = "undefined@undefined.undefined"
      }

      // Event type
      if(!payload.hasOwnProperty('type')){
          payload.type = "undefined"
      }

      // Fields
      if(!payload.hasOwnProperty('fields')){
          payload.fields = {}
      }

      // Details
      if(!payload.hasOwnProperty('details')){
          payload.details = {}
      }

      envelops.push({
        url: "https://track.bentonow.com/webhooks/"+config.site_key+"/"+config.your_integration_name+"/track",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:payload
      });
    }
    return envelops;
}
