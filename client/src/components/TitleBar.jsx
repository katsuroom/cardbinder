import { useContext, useRef, useState } from "react";
import StoreContext from "../store";

export default function TitleBar() {
    
    const { store } = useContext(StoreContext);

    const [isEditMode, setEditMode] = useState(false);
    const [titleText, setTitleText] = useState(store.getTitle());
    const textRef = useRef(null);

    const handleDoubleClick = (e) => {
        setEditMode(true);
    };

    const handleTextBlur = (e) => {
        if(!isEditMode)
            return;

        if(e.relatedTarget == textRef.current)
            return;

        endEditMode();
    }

    const endEditMode = () => {

        const text = titleText.trim();

        if(text == "") {
            setEditMode(false);
            return;
        }

        setEditMode(false);
        setTitleText(text);
        store.setTitle(text);
    };

    return (
        <div>
            <p
                style={{
                    marginBlockStart: 0,
                    color: "white",
                    padding: "1em",
                    paddingBottom: 0,
                    marginBottom: "-2em"
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={handleTextBlur}
                onDoubleClick={handleDoubleClick}
                tabIndex={0}
            >
                {
                    isEditMode ? 
                    <input type="text"
                        ref={textRef}
                        value={titleText}
                        onBlur={handleTextBlur}
                        onChange={(e) => setTitleText(e.target.value)}
                    />
                    : store.getTitle()
                }
            </p>
        </div>
    );
};