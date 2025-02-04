export const API_KEY = "";

export const BASE_URL = "https://v2.api.noroff.dev/";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register"; 
export const API_LOGIN ="/login"; 
export const API_KEY_URL ="/create-api-key"; 

export async function getAPIKey() {
    const respons = await fetch(API_BASE + API_AUTH + API_KEY_URL) {
        method: "POST"; 
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${load("token")}`,
            "X-Noroff-API-Key": API_KEY
        },
        body: JSON.stringify({
            name: "Test key",
        })
        {);    

    if(response.ok) {
        return await Response.json();
    }
    console.error(await response.json); 
    throw new Error("Could not register for an API key"); 
}



setAuthListner(); 