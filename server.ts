import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
 
// Generated by Copilot
async function getSessionData() {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    });
    // You can use the session object here or return it
    console.log(session); 
}

getSessionData();