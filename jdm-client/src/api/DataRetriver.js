import axios from "axios";
import idRelations from "../assets/id_relation.json";

/*const axiosDefaultConfig = {
    proxy: {
        host: "127.0.0.1",
        post: 5000,
        protocol: "http",
    },
};
const axiosInstance = axios.create(axiosDefaultConfig);*/
const axiosInstance = axios.create();
class DataRetriver {
    getAutoComplete = async (word, _cb) => {
        let res = await axiosInstance.get("/api/autocomplete", {
            params: { word },
        });
        _cb(res.data);
    };

    getTerm = async (word, type, _cb) => {
        console.log(type);
        let res = await axiosInstance.get("/api/find", {
            params: { word, type },
        });
        console.log(res.data);
        res = res.data;
        _cb(res);
    };

    getTermRelation = async (word, type, _cb) => {
        let res = await axiosInstance.get("/api/termRelation", {
            params: { word, type },
        });
        res = res.data;
        _cb(res);
    };
}

export default DataRetriver;
