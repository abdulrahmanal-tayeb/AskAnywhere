import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Message from './utils/Message'
import { Button } from '@mui/joy';
import { baseUrl } from '../config';
import { getHeaders } from '../utils/helpers';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const TicketsAdd = ({ticket, onBack}) => {
    const [mode, setMode] = useState(null);
    const [createdTicket, setCreatedTicket] = useState(null);
    const navigate = useNavigate();

    console.log("COOO: ", Cookies.get("mosnad_user"))
    const handleSubmit = (values, { setSubmitting }) => {
        if (!values) return;
        /* 
            This was commented out because there is a problem with the server. The user needs to register to get their details
            to be used even though they have one. Thus, a fixed value is hardcoded to make this work. Uncomment the code to give it a look!
        */
        // const user = Cookies.get("mosnad_user")
        // console.log(user);
        // if(!(user && Cookies.get("access_token"))){
        //     return navigate("/login/");
        // }
        // const userID = JSON.parse(user).id; // My ID Hardcoded

        const userID = 26; // My ID Hardcoded
        const routeDetais = ticket? {route: `api/tickets/${ticket.id}`, method: "PUT"} : {route: "api/tickets", method: "POST"};
        fetch(baseUrl + routeDetais.route, {
            method: routeDetais.method,
            body: JSON.stringify({...values, created_by: userID, status: "open"}),
            headers: getHeaders()
        }).then(response => response.json())
            .then(data => {
                if(!data.id){
                    toast.error("Something went wrong.");
                    return setSubmitting(false);
                }
                setCreatedTicket(data);
                setMode("complete");
            })
            .catch(e => {
                console.log(e);
                setSubmitting(false);
            });
    };


    switch (mode) {
        case "complete":
            return <Message>
                <div className="p-3" style={{ textAlign: "center" }}>
                    <h1>Ticket {ticket? "Updated" : "Submitted"}!</h1>
                    <p>
                        Your ticket has been saved, and is publicly available now.
                    </p>
                    {!ticket && <p className='mt-3'><strong>Ticket No. {createdTicket.id}</strong></p>}
                    <div style={{ textAlign: "center" }}>
                        <div className='flexed-centered'>
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                sx={{ alignSelf: 'center', fontWeight: 600 }}
                                onClick={() => ticket? window.location.href = window.location.href : navigate(`/tickets/?id=${createdTicket.id ?? ticket.id}`)}
                            >
                                View
                            </Button>
                        </div>
                    </div>
                </div>
            </Message>
        default:
            return (
                <div className="container mt-5">
                    {ticket && <Button className='m-3 mb-5' startDecorator={<i className='bi bi-chevron-left'/>} onClick={onBack}>Ticket</Button>}

                    <h1 className="mb-4">{ticket? `Edit Ticket ${ticket.id ?? ""}` : "Ticket Form"}</h1>
                    <Formik
                        initialValues={ticket ?? {
                            title: "",
                            device_name: "",
                            model: "",
                            serialNumber: "",
                            description: "",
                        }}
                        validationSchema={Yup.object({
                            title: Yup.string().required("Title is required."),
                            device_name: Yup.string().required("Device name is requried."),
                            model: Yup.string(),
                            serialNumber: Yup.string(),
                            description: Yup.string().required("Description is required."),
                        })}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className='flexed-centered' style={{ justifyContent: "flex-start", flexWrap: "wrap", alignItems: "flex-start" }} >
                                    {[
                                        {
                                            title: "Title",
                                            field: "title",
                                            fullWidth: true
                                        },
                                        {
                                            title: "Device Name",
                                            field: "device_name",
                                        },
                                        {
                                            title: "Device Model",
                                            field: "model",
                                            optional: true
                                        },
                                        {
                                            title: "Serial Number",
                                            field: "serialNumber",
                                            optional: true
                                        },
                                        {
                                            title: "Description",
                                            field: "description",
                                            fullWidth: true,
                                            otherProps: {
                                                as: "textarea",
                                                placeholder: "Describe your problem...",
                                                style: {width: "clamp(200px, 70vw, 650px)", flexGrow: 1}
                                                
                                            }
                                        }
                                    ].map(({ field, title, otherProps, fullWidth, optional }) => (
                                        <div className={`form-group mb-3 ${fullWidth? "col-12" : ""}`} style={{flexGrow: 1}}>
                                            <label htmlFor={field} className="form-label">{title} {!optional && <span style={{color: "red"}}>*</span>}</label>
                                            <Field type="text" className="form-control" id={field} name={field} {...otherProps} />
                                            <ErrorMessage name={field} component="div" className="text-danger" />
                                        </div>
                                    ))}
                                    <div className='col-12'>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            Submit{isSubmitting && "ting..."}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            );
    }
};

export default TicketsAdd;