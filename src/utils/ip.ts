export const ipWebsocket = import.meta.env.VITE_WEBSOCKET_IP;
export const apiOpenWeather = import.meta.env.VITE_OPENWEATHER_API;
export const ipStream = import.meta.env.VITE_STREAM_IP;
export const ipHTTP = import.meta.env.VITE_HTTP_IP;
export const ipTest = import.meta.env.VITE_TEST_IP;
export const tempToken = import.meta.env.VITE_TEMP_TOKEN;

export const ipUploadData = ipHTTP + "post-personal-img";
export const ipIdentifyData = ipHTTP + "get-all-data"; 
export const ipLogin = ipHTTP + "login";
export const ipPostCalendar = ipHTTP + "post-lich-tuan";
export const ipGetCalendar = ipHTTP + "get-lich-tuan";
export const ipCreateEvent = ipHTTP + "create-event";
export const ipGetEvents = ipHTTP + "get-events";
export const ipPutEvent = ipHTTP + "put-event";
export const ipDeleteEvent = ipHTTP + "delete-event";

