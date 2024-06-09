import { useEffect, useMemo, useState } from "react";
import CustomTable from "./utils/CustomTable";
import { Button } from "@mui/joy";
import TypedText from "./utils/TypedText";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../config";
import { getHeaders } from "../utils/helpers";
import Moment from "react-moment";
import { Skeleton } from "@mui/material";
import Cookies from "js-cookie";

export default function Tickets() {
    const [tickets, setTickets] = useState(null);
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(true);
    const user = useMemo(() => JSON.parse(Cookies.get("mosnad_user") ?? "[]"), []);
    useEffect(() => {
        if (tickets) return;
        fetch(baseUrl + "api/tickets", { headers: getHeaders() })
            .then(r => r.json())
            .then(tickets => {
                console.log("TICKETS: ", tickets);
                setFetching(false);
                setTickets(tickets);
            })
            .catch(console.log);
    }, [tickets]);
    console.log("USER", user);
    return (
        <>
            <div className="flexed-centered" style={{
                width: "100vw", height: "90vh", background: "linear-gradient(rgb(213 143 52), transparent)",
                flexDirection: "column", color: "white"
            }}>
                <h1 style={{ fontSize: "3em" }}>
                    <TypedText text={"Ask Anywhere!"}>
                        {(ref) => <strong ref={ref}></strong>}
                    </TypedText>
                </h1>
                {/* {user && <div style={{ flexDirection: "column", maxWidth: "90vw" }} className="flexed-centered">
                    <p><strong>Welcome, {user.name}!</strong></p>
                </div>} */}
            </div>
            <div className="p-3">

                <h1 className="mb-5">Tickets</h1>
                <div>
                    <Button className="mb-5" color="primary" onClick={() => navigate("/tickets/add/")}><i className="bi bi-plus-lg" /> Add Ticket</Button>
                    {tickets && tickets.length > 0 ?
                        <CustomTable
                            headRow={["Title", "No.", "State", "Last Updated"]}
                            data={[
                                ...tickets.map((ticket, index) => (
                                    [<Link to={`/tickets/?id=${ticket.id}`}>{ticket.title}</Link>, ticket.id, ticket.status === "closed" ? <span style={{ color: "red" }}>Closed</span> : <span style={{ color: "green" }}>Open</span>, <Moment fromNow>{ticket.updated_at}</Moment>]
                                ))
                            ]}
                        />
                        :
                        fetching ?
                            <CustomTable
                                headRow={["Title", "No.", "State", "Last Updated"]}
                                data={[
                                    ...new Array(5).fill(null).map((_, index) => (
                                        new Array(4).fill(null).map((__, _index) => <Skeleton key={_index}><span>Placeholder</span></Skeleton>)
                                    ))
                                ]}
                            />
                            :
                            <div className="flexed-centered" style={{
                                width: "100vw", height: "90vh",
                                flexDirection: "column", color: "white"
                            }}>
                                <h1>Couldn't find any ticket.</h1>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}