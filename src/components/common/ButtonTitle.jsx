import spinner_red from "../../assets/spinner_red.svg";
import spinner_green from "../../assets/spinner_green.svg";

function ButtonTitle({slot, loadingId}) {
    const RedSpinner = () => <img src={spinner_red} width="14px" />
    const GreenSpinner = () => <img src={spinner_green} width="14px" />

    if(slot.booked) {
        if(loadingId === slot.id) {
            return <RedSpinner />
        } else {
            return "Cancel"
        }
    } else {
        if(loadingId === slot.id) {
            return <GreenSpinner />
        } else {
            return "Book"
        }
    }
}

export default ButtonTitle