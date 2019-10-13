import React from "react";

// Toast imports
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const messageStyle = {
    opacity: "0.9"
}


// Sends a message to the toast handler
export function sendMessage(message, success) {
    if (messages >= MAX_MESSAGES) {
        return;
    }
    if (success) {
        toast.success(message, {timeout:PER_CHARACTER_TIME * message.length,
        });
    } else {
        toast.error(message, {timeout: PER_CHARACTER_TIME * message.length});
    }
}

var messages = 0;
var MAX_MESSAGES = 6;

toast.onChange(numberofToastDisplayed => {
    messages = numberofToastDisplayed;
})


const PER_CHARACTER_TIME = 50;

// Used to get a copy of the message handler. Should only be used in App.js
export function getMessageHandler() {
    return (<ToastContainer style={messageStyle}
            position={toast.POSITION.TOP_RIGHT}
            transition={Slide}
            hideProgressBar={true}
            />);

}
