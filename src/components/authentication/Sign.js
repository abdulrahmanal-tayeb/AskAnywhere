import { Slide } from "@mui/material";
import { forwardRef, useMemo, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../config";
import Cookies from "js-cookie";
export default function Sign() {
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const SignContainer = useMemo(() => forwardRef(({ children }, ref) => <div ref={ref} className="p-3" style={{ boxShadow: "0px 0px 20px 0px", borderRadius: "1em", maxWidth: 650 }} children={children} />), []);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (values, { setSubmitting }) => {
        if (isSigningIn) {
            fetch(baseUrl + "api/login", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then(response => response.json())
                .then(data => {
                    if (!data.access_token) {
                        setSubmitting(false);
                        return setError(true);
                    }
                    Cookies.set("access_token", data.access_token, { expires: 7 });
                    navigate("/");
                    // console.log(data);
                })
                .catch((e) => {
                    setSubmitting(false);
                    console.log(e);
                });
        } else {
            const { password, password_confirmation } = values;
            if (password !== password_confirmation) {
                return toast.error("Passwords must match");
            }

            fetch(baseUrl + "api/register", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${Cookies.get("access_token")}`
                }
            }).then(r => r.json())
                .then(data => {
                    if (!data.token) {
                        setSubmitting(false);
                        return setError(true);
                    }
                    Cookies.set("access_token", data.token, { expires: 7 });
                    Cookies.set("mosnad_user", JSON.stringify(data.user), { expires: 7 });
                    navigate("/");
                })
                .catch((e) => {
                    setSubmitting(false);
                    console.log(e);
                });
        }
    };

    const handleChangeMode = (isSigningIn) => {
        setError(false);
        const setters = [setIsSigningUp, setIsSigningIn];
        const [toGo, toCome] = isSigningIn ? setters : setters.reverse();
        toGo(false);
        setTimeout(() => toCome(true), 1000)
    }

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }} className="flexed-centered p-3 mt-5">
            <Slide in={true} direction="down" timeout={500}>
                <div className="flexed-center col-12 mb-5" style={{ textAlign: "center" }}>
                    <h1>Greetings There!</h1>
                </div>
            </Slide>
            <Slide unmountOnExit in={isSigningIn} timeout={500} direction={"left"}>
                <SignContainer>
                    <h3><strong>Sign in </strong></h3>
                    <div className="p-3">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={Yup.object({
                                email: Yup.string().email("Please provide a valid email address.").required(),
                                password: Yup.string().required()
                            })}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values }) => (
                                <Form>
                                    <div className='flexed-centered' style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>
                                        {error && <div className="col-12">
                                            <div className="alert alert-danger">
                                                Invalid email and/or password.
                                            </div>
                                        </div>}
                                        {[
                                            {
                                                label: "Email Address",
                                                field: "email",
                                            },
                                            {
                                                label: "Password",
                                                field: "password",
                                                type: "password"
                                            },
                                        ].map(({ field, label, type }, index) => (
                                            <div className="form-group mb-3" key={index}>
                                                <label htmlFor={field} className="form-label">{label}</label>
                                                <Field type={type ?? "text"} className="form-control" id={field} name={field} />
                                                <ErrorMessage name={field} component="div" className="text-danger" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className='col-12' style={{ display: "flex", gap: "1em", alignItems: "center", alignContent: "center" }}>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? "Logging you in..." : "Log in"}
                                        </button>
                                        <Link onClick={() => handleChangeMode(false)}>Don't have an account?</Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </SignContainer>
            </Slide>
            <Slide unmountOnExit in={isSigningUp} timeout={500} direction={"right"}>
                <SignContainer>
                    <h3><strong>Sign up</strong></h3>
                    <div className="p-3">
                        <Formik
                            initialValues={{ name: "", email: "", password: "", password_confirmation: "" }}
                            validationSchema={Yup.object({
                                email: Yup.string().email("Please provide a valid email address.").required("Email is required"),
                                password: Yup.string().required("Password is required."),
                                password_confirmation: Yup.string().required("Password confirmation is required."),
                                name: Yup.string().required("Your name is required."),
                            })}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values }) => (
                                <Form>
                                    <div className='flexed-centered' style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>
                                        {error && <div className="col-12">
                                            <div className="alert alert-danger">
                                                Invalid data provided.
                                            </div>
                                        </div>}
                                        {[
                                            {
                                                label: "Full Name",
                                                field: "name",
                                                fullWidth: true
                                            },
                                            {
                                                label: "Email Address",
                                                field: "email",
                                                fullWidth: true
                                            },
                                            {
                                                label: "Password",
                                                field: "password",
                                                type: "password"
                                            },
                                            {
                                                label: "Confirm Password",
                                                field: "password_confirmation",
                                                type: "password"
                                            },
                                        ].map(({ field, label, type, fullWidth }, index) => (
                                            <div key={index} className={`form-group mb-3 ${fullWidth ? "col-12" : ""}`} style={{ flexGrow: 1 }}>
                                                <label htmlFor={field} className="form-label">{label}</label>
                                                <Field type={type ?? "text"} className={`form-control ${fullWidth ? "col-12" : ""}`} id={field} name={field} style={{ width: "100%" }} />
                                                <ErrorMessage name={field} component="div" className="text-danger" />
                                            </div>
                                        ))}
                                        {values.password_confirmation && values.password && (values.password_confirmation !== values.password) &&
                                            <div className="col-12">
                                                <div className="alert alert-danger ">
                                                    Passwords must match
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className='col-12' style={{ display: "flex", gap: "1em", alignItems: "center", alignContent: "center" }}>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? "Signing up..." : "Sign up"}
                                        </button>
                                        <Link onClick={() => handleChangeMode(true)}>Already have an account?</Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </SignContainer>
            </Slide>
        </div>
    )
}