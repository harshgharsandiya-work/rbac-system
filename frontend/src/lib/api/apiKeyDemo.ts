import api from "./api";
import toast from "react-hot-toast";

export const apiKeyDemo = async (key: string) => {
    const res = await api.get("/demo/access", {
        headers: {
            "x-api-key": key,
            Authorization: undefined,
        },
    });

    return res.data;
};
