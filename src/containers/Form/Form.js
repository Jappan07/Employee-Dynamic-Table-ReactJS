import React, { Component } from "react"
import Input from "../../components/UI/Input/Input"
import Table from "../Table/Table"
import axios from "../../axios-global"
import Button from "../../components/UI/Button/Button"
import Spinner from "../../components/UI/Spinner/Spinner"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classes from "./Form.module.css"

class Form extends Component {

    componentDidMount() {
        const updatedEmployeeForm = { ...this.state.employeeForm }
        const updatedElement = { ...this.state.employeeForm["dateOfJoining"] }
        updatedElement.value = this.state.date.toDateString().substring(4)
        updatedEmployeeForm["dateOfJoining"] = updatedElement
        this.setState({ employeeForm: updatedEmployeeForm })
    }

    state = {
        employeeForm: {
            name: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Name"
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            empId: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Employee ID (5 digits)"
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            department: {
                elementType: "select",
                elementConfig: {
                    placeholder: "Department Name",
                    options: [
                        { value: "", displayValue: "Choose an option" },
                        { value: "hardware", displayValue: "Hardware" },
                        { value: "humanResource", displayValue: "Human Resource" },
                        { value: "marketing", displayValue: "Marketing" },
                        { value: "software", displayValue: "Software" },
                        { value: "operations", displayValue: "Operations" }
                    ]
                },
                value: "",
                validation: {},
                valid: true,
            },
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Email ID"
                },
                value: "",
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            dateOfJoining: {
                elementType: "Calendar",
                elementConfig: {
                    placeholder: "Date Of Joining (DOJ)"
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: true,
            },
        },
        loading: false,
        formIsValid: false,
        isFormSubmitted: false,
        date: new Date(),
        displayHeader: "Fill up the Employee Form"
    }

    onChange = (date, elementName) => {
        const updatedEmployeeForm = {
            ...this.state.employeeForm
        }
        const updatedElement = {
            ...this.state.employeeForm[elementName]
        }
        updatedElement.value = date.toDateString().substring(4)
        updatedEmployeeForm[elementName] = updatedElement
        this.setState({ employeeForm: updatedEmployeeForm, date: date })
    }

    inputChangedHandler = (event, elementName) => {
        const updatedEmployeeForm = {
            ...this.state.employeeForm
        }
        const updatedElement = {
            ...this.state.employeeForm[elementName]
        }

        updatedElement.value = event.target.value
        updatedElement.touched = true
        updatedElement.valid = this.validityChecker(updatedElement.value, updatedElement.validation)
        updatedEmployeeForm[elementName] = updatedElement
        let formIsValid = true
        for (let elementName in updatedEmployeeForm) {
            formIsValid = updatedEmployeeForm[elementName].valid && formIsValid
        }
        this.setState({ employeeForm: updatedEmployeeForm, formIsValid: formIsValid })
    }

    validityChecker(value, rules) {
        let isValid = true

        if (rules.required) {
            isValid = value.trim() !== "" && isValid
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        return isValid
    }

    onFormSubmitHandler = (event) => {
        event.preventDefault()
        if (this.state.formIsValid) {
            this.setState({ displayHeader: "Form Submitted ✅" })
            setTimeout(() => {
                this.setState({ isFormSubmitted: true })
                this.setState({ displayHeader: "New Hiring Details Table" })

                // storing the form data
                let formData = {}
                for (let elementName in this.state.employeeForm) {
                    formData[elementName] = this.state.employeeForm[elementName].value
                }
                axios.post("/employees.json", formData)
                    .then(response => {
                        this.setState({ loading: false })
                    })
                    .catch(error => {
                        this.setState({ loading: false })
                    })
            }, 1000);
        }
        else {
            this.setState({ displayHeader: "Form is Invalid ❌" })
        }
    }

    clearForm = () => {
        const updatedEmployeeForm = { ...this.state.employeeForm }

        for (let elementName in this.state.employeeForm) {
            updatedEmployeeForm[elementName].value = ""
        }

        this.setState({ employeeForm: updatedEmployeeForm, date: new Date(), displayHeader: "Fill up the Employee Form" })
    }

    renderFormAgain = () => {
        this.clearForm()
        const currDate = new Date()
        const updatedEmployeeForm = { ...this.state.employeeForm }
        const updatedElement = { ...this.state.employeeForm["dateOfJoining"] }
        updatedElement.value = currDate.toDateString().substring(4)
        updatedEmployeeForm["dateOfJoining"] = updatedElement
        this.setState({
            employeeForm: updatedEmployeeForm,
            isFormSubmitted: false,
            displayHeader: "Fill up the Employee Form",
            date: currDate
        })
    }

    render() {
        const formElementsArray = []
        for (let key in this.state.employeeForm) {
            formElementsArray.push({
                id: key,
                config: this.state.employeeForm[key]
            })
        }
        let renderComponent = (
            <div>
                <form className={classes.EmployeeFormContainer}>
                    {formElementsArray.map(element => {
                        if (element.id !== "dateOfJoining") {
                            return (
                                <React.Fragment key={element.id}>
                                    <label className={classes.Label} key={element.config.elementConfig.placeholder}> {element.config.elementConfig.placeholder}</label>
                                    <Input
                                        key={element.id}
                                        elementType={element.config.elementType}
                                        value={element.config.value}
                                        elementConfig={element.config.elementConfig}
                                        invalid={!element.config.valid}
                                        shouldValidate={element.config.validation}
                                        touched={element.config.touched}
                                        changed={(event) => this.inputChangedHandler(event, element.id)}
                                    />
                                </React.Fragment>
                            )
                        } else {
                            return (
                                <React.Fragment key={element.id}>
                                    <label className={classes.Label} key={element.config.elementConfig.placeholder}> {element.config.elementConfig.placeholder}</label><br />
                                    <DatePicker
                                        key={element.id}
                                        selected={this.state.date}
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="scroll"
                                        onChange={(event) => this.onChange(event, element.id)}
                                        dateFormat="dd/MM/yyyy" />
                                </React.Fragment>
                            )
                        }
                    })}
                </form>
                <Button clicked={this.clearForm}>Clear</Button>
                <Button clicked={this.onFormSubmitHandler}>Submit Details</Button>
                <Button clicked={() =>
                    this.setState({
                        isFormSubmitted: true,
                        displayHeader: "New Hiring Details Table"
                    })}>See Employee Table</Button>
            </div>
        )

        if (this.state.loading) {
            renderComponent = <Spinner />
        }

        if (this.state.isFormSubmitted) {
            renderComponent =
                <div className={classes.EmployeeTableContainer}>
                    <Table renderForm={this.renderFormAgain} formData={this.state.formData} />
                </div>
        }
        return (
            <div>
                <h2><u>{this.state.displayHeader}</u></h2>
                {renderComponent}
            </div>
        )
    }
}

export default Form