import React from 'react'
import {Formik,useField} from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
    firstName: yup.string()
        .required("Required Field")
        .matches(/^[A-Za-z]+$/,"Invalid First Name"),
    lastName: yup.string()
        .required("Required Field")
        .matches(/^[A-Za-z]+$/,"Invalid Last Name"),
    email: yup.string()
        .required("Required Field")
        .email("Invalid Email Address"),
    accepted: yup.boolean()
        .required("Required")
        .oneOf([true], "You must accept the terms and conditions."),   
    college: yup.string()
        .required("Required Field"),   
    subject: yup.string()
        .required("Required Field"),
})

const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label htmlFor={props.id || props.name} className="text-label">{label}</label>
        <input className="text-input" {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    )
}

const MyCheckbox = ({ text, ...props }) => {
    const [field, meta] = useField({ ...props, type: "checkbox" });
    return (
      <>
        <label className="checkbox">
          <input {...field} {...props} type="checkbox" />
          {text}
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    );
};

export const UserForm = () => {
    return(
        <Formik
            initialValues = {{
                firstName : "", 
                lastName : "",
                email: "",
                accepted: false,
                college: "",
                subject:""
            }}
            validationSchema = {validationSchema}
            onSubmit = {(values) => {
                alert(JSON.stringify(values, null, 2));
            }}
        >
            {formik => (
                <form onSubmit={formik.handleSubmit}>
                    <MyTextInput
                        label = "First Name"
                        name="firstName"
                        type="text"
                        placeholder="John"
                    /><br/>
                    <MyTextInput
                        label = "Last Name"
                        name="lastName"
                        type="text"
                        placeholder="Smith"
                    /><br/>
                    <MyTextInput
                        label = "Email"
                        name="email"
                        type="email"
                        placeholder="example@com"
                    /><br/>
                    <MyTextInput
                        label = "College"
                        name="college"
                        type="text"
                        placeholder="CHARUSAT"
                    /><br/>
                    <MyTextInput
                        label = "Subject"
                        name="subject"
                        type="text"
                        placeholder="Computer Science"
                    /><br/>
                    <MyCheckbox 
                        name="accepted"
                        text="I accept the terms and conditions"
                    /><br/>
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            )}
        </Formik>
    )
}