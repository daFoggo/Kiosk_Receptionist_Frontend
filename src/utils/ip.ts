export const ipWebsocket = import.meta.env.VITE_WEBSOCKET_IP;
export const apiOpenWeather = import.meta.env.VITE_OPENWEATHER_API;
export const ipStream = import.meta.env.VITE_STREAM_IP;
export const ipHTTP = import.meta.env.VITE_HTTP_IP;
export const ipFastAPITest = import.meta.env.VITE_FASTAPI_TEST_IP;
export const ipUploadData = ipHTTP + "post-personal-img";
export const ipGetData = ipHTTP + "get-all-data"; 
export const ipLogin = ipFastAPITest + "login";
