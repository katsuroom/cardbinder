import { createContext, useReducer } from "react";

const StoreContext = createContext();

const StoreAction = {
    CLEAR_ALL: "CLEAR_ALL",
    SET_CARD_SRC: "SET_CARD_SRC",
    SWAP_CARD_SRC: "SWAP_CARD_SRC"
};

export function StoreContextProvider({children}) {
    const [store, dispatch] = useReducer(storeReducer, {
        imgSrcs: new Array(9*48).fill(null)
    });

    function storeReducer(store, action) {
        const {type, payload} = action;
        switch(type) {
            case StoreAction.CLEAR_ALL: {
                const newCards = new Array(9*48).fill(null);
                return {
                    ...store,
                    imgSrcs: newCards
                };
            }
            case StoreAction.SET_CARD_SRC: {
                const newCards = [...store.imgSrcs];
                newCards[payload.index] = payload.src;
                return {
                    ...store,
                    imgSrcs: newCards
                };
            }
            case StoreAction.SWAP_CARD_SRC: {
                const newCards = [...store.imgSrcs];
                newCards[payload.srcIndex] = store.imgSrcs[payload.destIndex];
                newCards[payload.destIndex] = store.imgSrcs[payload.srcIndex];
                return {
                    ...store,
                    imgSrcs: newCards
                };
            }
            default:
                return;
        }
    }

    store.hasCard = (index) => {
        return store.imgSrcs[index] != null;
    };

    store.setImgSrc = (index, src) => {
        dispatch({
            type: StoreAction.SET_CARD_SRC,
            payload: {index, src}
        });
    };

    store.copyImgSrc = (srcIndex, destIndex) => {
        dispatch({
            type: StoreAction.SET_CARD_SRC,
            payload: {index: destIndex, src: store.imgSrcs[srcIndex]}
        });
    };

    store.clearSrc = (index) => {
        dispatch({
            type: StoreAction.SET_CARD_SRC,
            payload: {index, src: null}
        });
    };

    store.swapSrc = (srcIndex, destIndex) => {
        dispatch({
            type: StoreAction.SWAP_CARD_SRC,
            payload: { srcIndex, destIndex }
        });
    };

    store.clearAll = () => {
        dispatch({
            type: StoreAction.CLEAR_ALL
        });
    };

    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContext;