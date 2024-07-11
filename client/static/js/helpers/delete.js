// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { switchResponseStatus } from "./fetch.js";

// ---------------- DELETE THE DATA -----------------------------------------------------------------------------------------------------------------------
export async function deleteData(url) {
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });
        switchResponseStatus(response, data);
    } catch (error) {
        console.error(error.message);
    };
};