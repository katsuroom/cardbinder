import { useContext } from "react";
import StoreContext from "../store";

export default function ContextMenu(props) {

    const { store } = useContext(StoreContext);

    function menuOption(text, onClick) {
        return (
            <div
                className="menu-option"
                onClick={() => {
                    onClick();
                    props.setShowMenu(false);
                }}
            >
                {text}
            </div>
        );
    };

    function handleInsertPageBefore() {
        store.insertPage(props.num);
    };

    function handleInsertPageAfter() {
        store.insertPage(props.num+1);
    };

    function handleClearPage() {
        store.clearPage(props.num);
    };

    function handleDeletePage() {
        store.deletePage(props.num);
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
            <hr />
            {menuOption("Clear Page", handleClearPage)}
            {menuOption("Delete Page", handleDeletePage)}
            {/* {menuOption("Shift Cards Left")} */}
            {/* {menuOption("Shift Cards Right")} */}
        </div>
    );
}