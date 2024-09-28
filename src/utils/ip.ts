export const ipWebsocket = import.meta.env.VITE_WEBSOCKET_IP;
export const apiOpenWeather = import.meta.env.VITE_OPENWEATHER_API;
export const ipStream = import.meta.env.VITE_STREAM_IP;
export const ipHTTP = import.meta.env.VITE_HTTP_IP;
export const ipTest = import.meta.env.VITE_TEST_IP;
export const tempToken = import.meta.env.VITE_TEMP_TOKEN;

export const ipUploadData = ipHTTP + "post-personal-img";
export const ipIdentifyData = ipHTTP + "get-all-data"; 
export const ipLogin = ipHTTP + "login";
export const ipCreateEvent = ipTest + "create-event";
export const ipGetEvents = ipTest + "get-events";
export const ipPutEvent = ipTest + "put-event";
export const ipDeleteEvent = ipTest + "delete-event";


