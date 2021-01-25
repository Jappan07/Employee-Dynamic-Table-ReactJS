import React from "react"
import classes from "./Input.module.css"
import "./Input.module.css"

const input = (props) => {
    let inputElement = null
    let inputElementClasses = [classes.InputElement]

    if (props.invalid && props.shouldValidate && props.touched) {
        inputElementClasses.push(classes.Invalid)
    }

    switch (props.elementType) {
        case "input":
            inputElement = <input
                className={inputElementClasses.join(" ")}
                value={props.value} {...props.elementConfig}
                onChange={props.changed} />
            break;
        case "select":

            inputElement = <select
                className={inputElementClasses.join(" ")}
                value={props.value} {...props.elementConfig}
                onChange={props.changed}>
                {props.elementConfig.options.map(option => {
                    return (
                        <option
                            // selected={option.value === ""}
                            disabled={option.value === ""}
                            key={option.value}
                            value={option.value}>
                            {option.displayValue}
                        </option>
                    )
                })}
            </select>
            break;
        default:
            break;
    }
    return (
        <div>
            {inputElement}
        </div>
    )
}

export default input