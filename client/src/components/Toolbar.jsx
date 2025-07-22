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

        // add images to zip
        for(let i = 0; i < store.imgSrcs.length; ++i) {
            if(store.imgSrcs[i] != null) {
                const index = i;
                const parts = store.imgSrcs[i].split(";base64,");
                const mimeType = parts[0].split(":")[1];
                const base64 = parts[1];

                const bytes = atob(base64);
                const arr = new Array(bytes.length);
                for(let i = 0; i < arr.length; ++i) {
                    arr[i] = bytes.charCodeAt(i);
                }
                const byteArr = new Uint8Array(arr);

                const blob = new Blob([byteArr], {type: mimeType});

                zip.file(index + ".jpg", blob);
            }
        }

        // get zip
        const zipfile = await zip.generateAsync({type: "blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipfile);
        link.download = "binder" + fileExt;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleImport = () => {
        const input = document.getElementById("file-selector");
        input.click();
    }

    const handleChange = (e) => {
        const zip = e.target.files[0];

        JSZip.loadAsync(zip)
        .then(zip => {

            // clear all
            store.clearAll();

            Object.keys(zip.files).forEach(path => {
                const file = zip.files[path];
                const index = Number(path.split(".")[0]);

                file.async("blob")
                .then(blob => {
                    util.blobTobase64(blob)
                    .then(base64 => {
                        // draw to canvas
                        store.setImgSrc(index, base64);
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