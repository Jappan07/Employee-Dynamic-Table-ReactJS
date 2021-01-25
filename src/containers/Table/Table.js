import React, { Component } from "react"
import axios from "../../axios-global"
import classes from "./Table.module.css"
import Button from "../../components/UI/Button/Button"
import Spinner from "../../components/UI/Spinner/Spinner"

class Table extends Component {
    state = {
        formData: [],
        loading: true
    }

    componentDidMount() {
        axios.get("/employees.json")
            .then(response => {
                const fetchEmployeeData = []
                for (let key in response.data) {
                    fetchEmployeeData.push({
                        ...response.data[key],
                        id: key
                    })
                }
                this.setState({ formData: fetchEmployeeData, loading: false })
            })
            .catch(error => {
                this.setState({ loading: false })
            })
    }

    renderHeaders = () => {
        const headers = ["Employee ID", "Name", "Department", "Email ID", "DOJ", ""]
        return headers.map(heading => {
            return (
                <th key={heading}>{heading}</th>
            )
        })
    }

    onDeleteHandler = (id) => {
        this.setState((prevState) => ({
            formData: prevState.formData.filter(element => {
                return element.id !== id
            })
        }))
        axios.delete(`/employees/${id}.json`)
    }

    render() {
        let table = (
            <table className={classes.Table}>
                <tbody>
                    <tr className={classes.Headers}>
                        {this.renderHeaders()}
                    </tr>
                    {this.state.formData.map(employee => {
                        return (
                            <tr key={employee.id} >
                                <td>{employee.empId}</td>
                                <td>{employee.name}</td>
                                <td>{employee.department}</td>
                                <td>{employee.email}</td>
                                <td>{employee.dateOfJoining}</td>
                                <td><span className={classes.Remove} onClick={() => this.onDeleteHandler(employee.id)}>❌</span></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
        if (this.state.loading) {
            table = <Spinner />
        }
        return (
            <React.Fragment>
                {table}
                <Button clicked={this.props.renderForm}>Submit another form</Button>
            </React.Fragment>
        )
    }
}

export default Table