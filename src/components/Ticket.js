import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../config";
import { Button, Divider } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { getHeaders } from "../utils/helpers";
import TicketsAdd from "./TicketsAdd";
import Moment from "react-moment";
import { CircularProgress, Slide } from "@mui/material";
export default function Ticket() {
    const [comments, setComments] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [fetching, setFetching] = useState(false);
    const navigate = useNavigate();
    // const Comment = useMemo((props) => <div className="p-3"><p>{props && props.children}</p></div>, []);
    const ticketID = useMemo(() => new URLSearchParams(window.location.search).get("id"), []);

    useEffect(() => {
        const id = ticketID;
        setTicket({ id });
        if (!id) {
            navigate("/");
            return;
        };
        setComments(JSON.parse(localStorage.getItem(`issueComments-${ticketID}`)));
        /* 
            500 Internal Server Error is being returned from the API. Actually there isn't any hint or a descriptive error message 
            on how to deal with this.
        */
        fetch(baseUrl + `api/tickets/${id}`, {
            headers: getHeaders()
        })
            .then(r => r.json())
            .then(ticket => ticket && setTicket(ticket))
            .catch(console.log);
    }, []);

    const handleAddComment = (values, { setSubmitting, resetForm }) => {
        const { comment } = values;
        if (!comment) return;
        const storeName = `issueComments-${ticketID}`;
        let previousComments = JSON.parse(localStorage.getItem(storeName));
        if (!previousComments) {
            previousComments = [comment]
        } else {
            previousComments.unshift(comments);
        }
        localStorage.setItem(storeName, JSON.stringify(previousComments))
        resetForm();
        setComments(previousComments);
        setSubmitting(false);
    }

    const changeStatus = (status) => {
        setFetching(true);
        fetch(baseUrl + `api/tickets/${ticketID}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
            headers: getHeaders()
        }).then(r => r.json())
            .then(data => {
                if (data.id) {
                    setTicket(data);
                }
            }).catch(console.log)
            .finally(() => setFetching(false));
    }

    if (!ticket) return null;
    return isEditing && ticket ? <TicketsAdd ticket={{ ...ticket, id: ticketID }} onBack={() => setIsEditing(false)} /> : (
        <div className="p-3">
            <div className="flexed-centered mt-5" style={{ flexDirection: "column", alignContent: "flex-start", alignItems: "flex-start" }}>
                <h1 className="flexed-centered">Issue No. {ticketID} <Button color={"warning"} onClick={() => setIsEditing(true)} startDecorator={<i className="bi bi-pen" />}>Edit</Button></h1>
                <div className="mb-3">
                    {fetching ?
                        <CircularProgress />
                        : ticket.status === "open" ?
                            <div className="flexed-centered">
                                <p style={{ color: "green", borderRadius: "1em", marginBottom: 0 }}><strong>Opened</strong></p>
                                <Button onClick={() => changeStatus("closed")} color={"danger"}>Close</Button>
                            </div>
                            :
                            <div className="flexed-centered">
                                <p style={{ color: "red", borderRadius: "1em", marginBottom: 0 }}><strong>Closed</strong></p>
                                <Button onClick={() => changeStatus("open")} color={"success"}>Open</Button>
                            </div>
                    }
                </div>
                <div>
                    <p> <i className="bi bi-dot" /> Created on:  <strong><Moment format={"DD MMM, YYYY h:mmA"} local>{ticket.created_at}</Moment></strong></p>
                    <p> <i className="bi bi-dot" /> Last updated:  <strong><Moment format={"DD MMM, YYYY h:mmA"} local>{ticket.updated_at}</Moment></strong></p>
                </div>
            </div>
            <hr />

            <div className="mt-5">
                <div className="mb-5">
                    <h3 className="mb-3"><strong>{ticket.title}</strong></h3>
                    <Divider sx={{ marginTop: "1em" }} />
                    <p className="p-3">{ticket.description}</p>
                </div>

                <h3 className="mb-3">Comments</h3>
                {comments && comments.length > 0 ?
                    comments.map((comment, index) => (
                        <Slide in={true} direction="right" timeout={500 + 100 * index}>
                            <div className="p-3 comment" key={index}>
                                <p>{comment}</p>
                            </div>
                        </Slide>
                    ))
                    :
                    <p><strong>No Comments... be the first!</strong></p>
                }
                <Formik
                    initialValues={{ comment: "" }}
                    validationSchema={Yup.object({
                        comment: Yup.string().required("Comment is required"),
                    })}
                    onSubmit={handleAddComment}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className='flexed-centered' style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>

                                <div className="form-group mb-3">
                                    <Field

                                        as="textarea"
                                        id="comment"
                                        name="comment"
                                        className="form-control"
                                        placeholder="Add your comment..."
                                    />
                                    <ErrorMessage name={"comment"} component="div" className="text-danger" />
                                </div>

                                <div className='col-12'>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        Comment{isSubmitting && "ting..."}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}