import { createContext, useReducer, useRef } from "react";

const StoreContext = createContext();

const StoreAction = {
    SET_HAS_CARD: "SET_HAS_CARD"
};

export function StoreContextProvider({children}) {
    const [store, dispatch] = useReducer(storeReducer, {
        hasCard: new Array(9*48).fill(false),
        canvasRefs: useRef(new Array(9*48)),
        copied: null
    });

    function storeReducer(store, action) {
        const {type, payload} = action;
        switch(type) {
            case StoreAction.SET_HAS_CARD: {
                const newHasCard = [...store.hasCard];
                newHasCard[payload.index] = payload.value;
                return {
                    ...store,
                    hasCard: newHasCard
                };
            }
            default:
                return;
        }
    }

    store.setHasCard = function(index, value) {
        dispatch({
            type: StoreAction.SET_HAS_CARD,
            payload: { index, value }
        });
    }

    store.getCanvasElement = function(index) {
        return store.canvasRefs.current[index];
    }

    store.drawCanvas = async function(index, base64) {

        const canvas = store.getCanvasElement(index);
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
    }

    store.copyCanvas = async function(destIndex, srcIndex) {

        const src = store.getCanvasElement(srcIndex);
        if(store.hasCard[srcIndex] == false)
            return;

        const canvas = store.getCanvasElement(destIndex);
        const ctx = canvas.getContext("2d");

        const newWidth = canvas.width;
        const newHeight = (src.height / src.width) * newWidth;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(src, 0, 0, newWidth, newHeight);
        store.setHasCard(destIndex, true);
    }

    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContext;