// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { switchResponseStatus } from "./fetch.js";

// ---------------- POST THE DATA -------------------------------------------------------------------------------------------------------------------------
export async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        switchResponseStatus(response, data);
    } catch (error) {
        console.error(error.message);
    };
};