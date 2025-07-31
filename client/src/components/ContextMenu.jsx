import { useContext } from "react";
import StoreContext from "../store";

function menuOption(text, onClick) {
    return (
        <div
            className="menu-option"
            onClick={onClick}
        >
            {text}
        </div>
    );
}

export default function ContextMenu(props) {

    const { store } = useContext(StoreContext);

    function handleInsertPageBefore() {
        props.setShowMenu(false);
        store.insertPage(props.num);
    };

    function handleInsertPageAfter() {
        props.setShowMenu(false);
        store.insertPage(props.num+1);
    };

    function handleShiftCardsLeft() {
        props.setShowMenu(false);
    };

    function handleShiftCardsRight() {
        props.setShowMenu(false);
    };

    const handleBlur = (e) => {
        if(e.relatedTarget != props.buttonRef.current) {
            props.setShowMenu(false);
        }
    };

    return (
        <div
            ref={props.ref}
            className="context-menu"
            onFocus={(e) => {e.stopPropagation(); }}
            onBlur={handleBlur}
            tabIndex={0}
        >
            {menuOption("Insert Page Before", handleInsertPageBefore)}
            {menuOption("Insert Page After", handleInsertPageAfter)}
            {/* {menuOption("Shift Cards Left")} */}
            {/* {menuOption("Shift Cards Right")} */}
        </div>
    );
}