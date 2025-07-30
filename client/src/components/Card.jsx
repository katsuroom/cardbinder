import { useState, useContext } from "react";
import StoreContext from "../store";

const cardHeight = 120;
const cardWidth = 120 / 88 * 63;

export default function Card(props) {

    const { store } = useContext(StoreContext);

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
        e.stopPropagation();
        setIsFocused(true);
    }

    const handleUnfocus = (e) => {
        store.hideContextMenu();
        setIsFocused(false);
    }

    const handleClick = (e) => {
        const targetEl = e.target;
        if(targetEl.tagName == "IMG") {
            targetEl.parentElement.focus();
        }
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        store.setContextMenu(props.num);
    }

    const handleKeyDown = (e) => {
        if(e.key == "Delete") {
            store.deleteCard(props.num);
            e.target.blur();
        }
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", props.num);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        const srcIdx = Number(e.dataTransfer.getData("text/plain"));
        const destIdx = props.num;
        if(srcIdx == destIdx)
            return;

        store.swapCards(srcIdx, destIdx);
    }

    const handleCopy = () => {
        const cards = [];
        cards.push(store.getCard(props.num));

        navigator.clipboard.write([
            new ClipboardItem({
                "text/plain": new Blob([JSON.stringify(cards)], {type: "text/plain"})
            })
        ]);
    }

    const handleCut = () => {
        handleCopy();
        store.deleteCard(props.num);
    }

    const handlePaste = async (e) => {

        e.target.blur();
        const items = await navigator.clipboard.read();

        for(const item of items) {

            // get image mimetype
            const imageType = item.types.find(type => type.startsWith("image/"));
            if(imageType) {
                // load image data
                const blob = await item.getType(imageType);
                const reader = new FileReader();
                reader.readAsDataURL(blob);

                reader.onload = function(e) {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = function() {

                        // create canvas for resizing
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        const newWidth = cardWidth;
                        const newHeight = (img.height / img.width) * newWidth;

                        canvas.width = newWidth;
                        canvas.height = newHeight;

                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                        const base64 = canvas.toDataURL("image/jpeg", 0.9);
                        store.setCard(props.num, base64, "");
                        canvas.remove();
                    }
                }
            }
            else if(item.types.includes("text/plain")) {

                // paste from another canvas
                const blob = await item.getType("text/plain");
                const text = await blob.text();

                try {
                    const cards = JSON.parse(text);
                    if(cards.length == 1) {
                        const card = cards[0];
                        store.setCard(props.num, card.src, card.text);
                    }
                }
                catch(err) {}
            }
        }
    }

    let selectedClass = isFocused ? " card-selected" : "";

    return (
        <div>
            <div
                className={`card${selectedClass}`}
                tabIndex={0}
                onCopy={handleCopy}
                onCut={handleCut}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                onContextMenu={handleRightClick}
                onBlur={handleUnfocus}
                onFocus={handleFocus}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggable={true}
                style={{
                    border: store.hasCard(props.num) ? "2px solid rgb(63, 63, 63)" : "2px solid rgb(127, 127, 127)",
                    width: cardWidth,
                    height: cardHeight
                }}
            >
                <p style={{
                    position: "absolute",
                    marginBlock: 0,
                    fontSize: "8pt",
                    color: store.hasCard(props.num) ? "white" : "black",
                    bottom: 5,
                    left: 5
                }}>{props.num}</p>
                <img
                    style={{
                        visibility: store.hasCard(props.num) ? "visible" : "hidden"
                    }}
                    id={`card-${props.num}`}
                    width={cardWidth}
                    height={cardHeight}
                    src={store.getCardSrc(props.num)}
                />
            </div>
            {/* <p
                style={{
                    color: "white",
                    fontSize: "8pt",
                    marginBlock: 0,
                    marginTop: "0.5em"
                }}
            >
                Name
            </p> */}
        </div>
    );
}