import Cookies from "js-cookie";

export function getHeaders(){
    return ({
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${Cookies.get("access_token")}`
    })
}