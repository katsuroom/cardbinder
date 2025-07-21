import { useState, useRef, useContext, useLayoutEffect } from "react";
import StoreContext from "../store";
import util from "../util";

export default function Card(props) {

    const { store } = useContext(StoreContext);

    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const cardRef = useRef(null);
    const canvasRef = useRef(null);

    useLayoutEffect(() => {
        store.canvasRefs.current[props.num] = canvasRef.current;
        canvasRef.current.width = cardRef.current?.clientWidth;
        canvasRef.current.height = cardRef.current?.clientHeight;
    }, []);

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
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            e.target.blur();

            store.setHasCard(props.num, false);
        }
    }

    const handleDragStart = (e) => {
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {

    }

    const handleCopy = async () => {
        navigator.clipboard.write([
            new ClipboardItem({
                "text/html": new Blob([canvasRef.current.outerHTML], {type: "text/html"})
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
                // paste image data
                const blob = await item.getType(imageType);
                const base64 = await util.blobTobase64(blob);

                store.drawCanvas(props.num, base64);
            }
            else if(item.types.includes("text/html")) {
                // paste from another canvas
                const blob = await item.getType("text/html");
                const html = await blob.text();
                
                const parser = new DOMParser();
                const el = parser.parseFromString(html, "text/html");
                const canvas = el.querySelector("canvas");

                if(canvas) {
                    store.copyCanvas(props.num, Number(canvas.id.replace("card-", "")));
                }
            }

            
        }
    }

    let selectedClass = isFocused ? "card-selected" : "";

    return (
        <div>
        <div
            ref={cardRef}
            className={`card ${selectedClass}`}
            tabIndex={0}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onContextMenu={handleRightClick}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            // onDragStart={handleDragStart}
            // onDragOver={handleDragOver}
            // onDrop={handleDrop}
            // draggable={true}
            style={{
                border: store.hasCard[props.num] ? "2px solid rgb(63, 63, 63)" : "2px solid rgb(127, 127, 127)"
            }}
        >
            <div className="loading">
                {isLoading && <p>Loading...</p>}
            </div>
            <p style={{
                position: "absolute",
                marginBlock: 0,
                fontSize: "8pt",
                color: "white",
                bottom: 5,
                left: 5
            }}>{props.num}</p>
            <canvas
                ref={canvasRef}
                id={`card-${props.num}`}
                // width="100%"
                // height="100%"
            />
        </div>
        </div>
    );
}