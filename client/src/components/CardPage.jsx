import { useState, useContext, useRef } from "react";
import Card from "./Card";
import ContextMenu from './ContextMenu';

import StoreContext from "../store";
import { Global } from "../util";

export default function CardPage(props) {

    const { store } = useContext(StoreContext);

    const [isFocused, setIsFocused] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [pageText, setPageText] = useState(store.getPageText(props.num) || "");

    const menuButtonRef = useRef(null);
    const menuRef = useRef(null);
    const textRef = useRef(null);

    const selectedClass = isFocused ? " card-page-selected" : "";

    const handleKeyDown = (e) => {
        if(!isFocused)
            return;

        if(e.key == "Delete") {
            store.deletePage(props.num);
            e.target.blur();
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleBlurMenu = (e) => {
        if(e.relatedTarget != menuRef.current)
            setShowMenu(false);
    };


    const handleCopy = () => {
        if(!isFocused)
            return;

        const cards = [];
        for(let i = props.num*9; i < props.num*9+9; ++i) {
            cards.push(store.getCard(i));
        }

        navigator.clipboard.write([
            new ClipboardItem({
                "text/plain": new Blob([JSON.stringify(cards)], {type: "text/plain"})
            })
        ]);
    };

    const handlePaste = async (e) => {
        if(!isFocused)
            return;

        e.target.blur();
        const items = await navigator.clipboard.read();

        for(const item of items) {
            if(item.types.includes("text/plain")) {
                // paste up to 9 cards
                const blob = await item.getType("text/plain");
                const text = await blob.text();

                try {
                    const cards = JSON.parse(text);
                    for(let i = 0; i < Math.min(cards.length, 9); ++i) {
                        const card = cards[i];
                        if(card == null)
                            continue;
                        
                        store.setCard(props.num*9+i, card.src, card.text);
                    }
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    };

    const handleDropdown = () => {
        setShowMenu(!showMenu);
    };

    const handleDoubleClick = () => {
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

        const text = pageText.trim();

        if(!store.getPageText(props.num) && text == "") {
            setEditMode(false);
            return;
        }

        setEditMode(false);
        setPageText(text);
        store.setPageText(props.num, text);
    };

    function getText() {
        const text = store.getPageText(props.num);
        if(text == null || text == "") {
            return props.num;
        }
        else
            return text;
    };

    return (
        <div
            className={`card-page${selectedClass}`}
            onKeyDown={handleKeyDown}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onBlur={handleBlur}
            onFocus={() => setIsFocused(true)}
            tabIndex={0}
        >
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5em"
            }}>
                {Array.from({length: Global.cardsPerPage}).map((_, i) => <Card key={i} num={props.num*Global.cardsPerPage + i}/>)}
            </div>
            <div style={{
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                gap: "1em"
            }}>
                <p
                    style={{
                        marginBlockEnd: 0,
                        whiteSpace: "pre-line",
                        fontSize: "10pt",
                        lineHeight: 1.5,
                        width: "100%"
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onBlur={handleTextBlur}
                    onDoubleClick={handleDoubleClick}
                    tabIndex={0}
                >
                    {
                        isEditMode ? 
                        <textarea rows="3"
                            style={{
                                resize: "none",
                                width: "100%"
                            }}
                            ref={textRef}
                            value={pageText}
                            onBlur={handleTextBlur}
                            onChange={(e) => setPageText(e.target.value)}
                        />
                        : getText()
                    }
                </p>
                <button
                    ref={menuButtonRef}
                    className="dropdown-button"
                    onClick={handleDropdown}
                    onFocus={(e) => e.stopPropagation()}
                    onBlur={handleBlurMenu}
                >
                    <span className="fa-solid fa-ellipsis-vertical" />
                </button>
                {
                    showMenu ? 
                    <ContextMenu ref={menuRef} num={props.num} buttonRef={menuButtonRef} setShowMenu={setShowMenu}/>
                    : null
                }
            </div>
        </div>
    );
}