import axios from "axios";


const request = axios.create({
    timeout: 6000,
    headers: { "Content-Type": "application/json" },
} as any);


const api = {
    getHash(hash:string){
        return request.get(`${hash}`);
    },
    getData(url:string) {
        return request.get(url);
    }
}

export default api;