import { useState, useRef, useContext, useLayoutEffect, useEffect } from "react";
import StoreContext from "../store";
import util from "../util";

export default function Card(props) {

    const { store } = useContext(StoreContext);

    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const cardRef = useRef(null);
    const canvasRef = useRef(null);

    useLayoutEffect(() => {
        if(props.num == 0) console.log("useLayoutEffect");
        store.canvasRefs.current[props.num] = canvasRef.current;
        canvasRef.current.width = cardRef.current?.clientWidth;
        canvasRef.current.height = cardRef.current?.clientHeight;
    }, []);

    // useEffect(() => {
    //     if(props.num == 0) console.log("useEffect");
    //     canvasRef.current = store.canvasRefs.current[props.num];
    // }, [store.canvasRefs.current[props.num]]);

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

        store.copyCanvas(srcIdx, destIdx);
        store.clearCanvas(srcIdx);
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
                    store.copyCanvas(Number(canvas.id.replace("card-", "")), props.num);
                }
            }

            
        }
    }

    let selectedClass = isFocused ? " card-selected" : "";

    return (
        <div
            ref={cardRef}
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
    );
}