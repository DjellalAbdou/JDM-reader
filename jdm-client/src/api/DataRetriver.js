import axios from "axios";

const axiosDefaultConfig = {
    proxy: {
        host: "127.0.0.1",
        post: 5000,
        protocol: "http",
    },
};
const axiosInstance = axios.create(axiosDefaultConfig);
class DataRetriver {
    getAutoComplete = async (word, _cb) => {
        let res = await axiosInstance.get("/api/autocomplete", {
            params: { word },
        });
        _cb(res.data);
    };
}

export default DataRetriver;
