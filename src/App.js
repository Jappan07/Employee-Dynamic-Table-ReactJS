import React, { Component } from "react"
import Form from "./containers/Form/Form"
import Button from "./components/UI/Button/Button"
import classes from './App.module.css';

class App extends Component {

  state = {
    showForm: false
  }

  toggleFormHandler = () => {
    this.setState(prevState => (
      { showForm: !prevState.showForm }
    ))
  }

  render() {
    return (
      <div className={classes.App} >
        <Button clicked={this.toggleFormHandler}>{!this.state.showForm ? "Open" : "Close"} Application</Button>
        {this.state.showForm ? <Form /> : <h1>NEW HIRING EMPLOYEE APPLICATION</h1>}
      </div>
    )
  }
}

export default App;
