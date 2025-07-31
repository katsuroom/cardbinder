import { useContext } from "react";
import JSZip from "jszip";

import StoreContext from "../store";
import { blobTobase64, Global, LayoutMode } from "../util";

export default function Toolbar() {

    const { store } = useContext(StoreContext);

    const fileExt = ".binder";

    const handleNewBinder = () => {
        if(confirm("Create new binder?")) {
            store.newBinder();
        }
    };

    const handleNewGallery = () => {
        if(confirm("Create new gallery?")) {
            store.newGallery();
        }
    };

    const handleExport = async () => {

        const zip = new JSZip();

        // collect image filenames
        let cards = new Array(store.getNumCards()).fill(null);

        // add images to zip
        for(let i = 0; i < store.getNumCards(); ++i) {
            if(store.hasCard(i) == true) {
                const parts = store.getCardSrc(i).split(";base64,");
                const mimeType = parts[0].split(":")[1];
                const base64 = parts[1];

                const bytes = atob(base64);
                const arr = new Array(bytes.length);
                for(let j = 0; j < arr.length; ++j) {
                    arr[j] = bytes.charCodeAt(j);
                }
                const byteArr = new Uint8Array(arr);

                const blob = new Blob([byteArr], {type: mimeType});

                const filename = i + ".jpg";
                cards[i] = {
                    filename,
                    text: store.getCardText(i)
                };

                zip.file(filename, blob);
            }
        }

        const config = {
            layout: store.getLayout(),
            cards: cards
        };

        // add json to zip
        const jsonStr = JSON.stringify(config);
        const jsonBlob = new Blob([jsonStr], {type: "application/json"});

        zip.file("config.json", jsonBlob);

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

    const handleChange = async (e) => {
        const file = e.target.files[0];

        const zip = await JSZip.loadAsync(file);

        const configFile = zip.files["config.json"];
        if(configFile) {
            // new import
            const blob = await configFile.async("blob");
            const text = await blob.text();

            const config = JSON.parse(text);
            const layout = config.layout;

            const cards = new Array(config.cards.length).fill(null);

            for(let i = 0; i < config.cards.length; ++i) {
                if(config.cards[i] == null)
                    continue;

                const cardText = config.cards[i].cardText;
                const cardFilename = config.cards[i].filename;

                const cardFile = zip.files[cardFilename];

                const cardBlob = await cardFile.async("blob");
                const base64 = await blobTobase64(cardBlob);
                cards[i] = store.createCard(base64, cardText);
            }

            if(layout == LayoutMode.BINDER)
                store.importBinder(cards);
            else if(layout == LayoutMode.GALLERY)
                store.importGallery(cards);
        }
        else {
            // old import
            const cards = new Array(Global.defaultBinderSize).fill(null);

            for(const path of Object.keys(zip.files)) {
                const file = zip.files[path];
                const index = Number(path.split(".")[0]);

                const blob = await file.async("blob");
                const base64 = await blobTobase64(blob);

                cards[index] = store.createCard(base64, "");
            }
            
            store.importBinder(cards);
        }
    }

    return (
        <div id="toolbar">
            {
                store.getLayout() == LayoutMode.BINDER ?
                    <h2>card<span style={{color: "deepskyblue"}}>binder</span></h2>
                    :
                    <h2>card<span style={{color: "violet"}}>gallery</span></h2>
            }
            
            <div style={{display: "flex", gap: "1em"}}>
            
            <input
                style={{display: "none"}}
                type="file"
                id="file-selector"
                accept={fileExt}
                onChange={handleChange}
            />
            <button onClick={handleNewBinder}>New Binder</button>
            <button onClick={handleNewGallery}>New Gallery</button>
            <button onClick={handleImport}>Import Binder</button>
            <button onClick={handleExport}>Export Binder</button>
            </div>
        </div>
    );
};