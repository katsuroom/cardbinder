import { useContext } from "react";
import JSZip from "jszip";

import StoreContext from "../store";
import util from "../util";

export default function Toolbar() {

    const { store } = useContext(StoreContext);

    const fileExt = ".binder";

    const handleExport = async () => {

        // let imgs = [];
        const zip = new JSZip();

        // get imgs
        for(let i = 0; i < store.hasCard.length; ++i) {
            if(store.hasCard[i] == true) {
                const index = i;
                const canvas = document.getElementById("card-" + index);
                const dataURL = canvas.toDataURL();

                const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

                zip.file("card-" + index + ".png", blob);
            }
        }

        // get zip
        const zipfile = await zip.generateAsync({type: "blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipfile);
        link.download = "binder" + fileExt;
        link.click();
        URL.revokeObjectURL(link.href);
        link.remove();
    };

    const handleImport = () => {
        const input = document.getElementById("file-selector");
        input.click();
    }

    const handleChange = (e) => {
        const zip = e.target.files[0];

        JSZip.loadAsync(zip)
        .then(zip => {
            Object.keys(zip.files).forEach(path => {
                const file = zip.files[path];
                const canvasId = path.split(".")[0];
                const index = Number(canvasId.replace("card-", ""));

                file.async("blob")
                .then(blob => {
                    util.blobTobase64(blob)
                    .then(base64 => {
                        // draw to canvas
                        const canvas = document.getElementById(canvasId);
                        const ctx = canvas.getContext("2d");

                        const image = new Image();
                        image.src = base64;

                        image.onload = () => {
                            const newWidth = canvas.width;
                            const newHeight = (image.height / image.width) * newWidth;

                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(image, 0, 0, newWidth, newHeight);

                            store.setHasCard(index, true);
                        };
                    });
                });
            });
        })
        .catch(err => console.log(err));
    }

    return (
        <div id="toolbar">
            <h2>cardbinder</h2>
            <div style={{display: "flex", gap: "1em"}}>
            
            <input
                style={{display: "none"}}
                type="file"
                id="file-selector"
                accept={fileExt}
                onChange={handleChange}
            />
            <button onClick={handleImport}>Import Binder</button>
            <button onClick={handleExport}>Export Binder</button>
            </div>
        </div>
    );
};