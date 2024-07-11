// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { switchResponseStatus } from "./fetch.js";

// ---------------- EDIT THE DATA -------------------------------------------------------------------------------------------------------------------------
export async function putData(url, data) {
    try {
        const response = await fetch(url, {
            method: "PUT",
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