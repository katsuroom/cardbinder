import { useState, useContext } from "react";
import StoreContext from "../store";
import util from "../util";

const cardHeight = 120;
const cardWidth = 120 / 88 * 63;

export default function Card(props) {

    const { store } = useContext(StoreContext);

    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (e) => {
        const targetEl = e.target;
        if(targetEl.tagName == "IMG") {
            targetEl.parentElement.focus();
        }
    }

    const handleRightClick = (e) => {
    }

    const handleKeyDown = (e) => {
        if(e.key == "Delete") {
            store.clearSrc(props.num);
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

        store.swapSrc(srcIdx, destIdx);
    }

    const handleCopy = async () => {
        navigator.clipboard.write([
            new ClipboardItem({
                "text/html": new Blob([props.num], {type: "text/html"})
            })
        ]);
    }

    const handlePaste = async (e) => {

        if(!isFocused) return;

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
                        store.setImgSrc(props.num, base64);
                        canvas.remove();
                    }
                }
            }
            else if(item.types.includes("text/html")) {

                // paste from another canvas
                const blob = await item.getType("text/html");
                const text = await blob.text();

                const srcIndex = Number(text);
                store.copyImgSrc(srcIndex, props.num);
            }
        }
    }

    let selectedClass = isFocused ? " card-selected" : "";

    return (
        <div
            className={`card${selectedClass}`}
            tabIndex={0}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onContextMenu={handleRightClick}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
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
            <div className="loading">
                {isLoading && <p>Loading...</p>}
            </div>
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
                src={store.imgSrcs[props.num]}
            />
        </div>
    );
}