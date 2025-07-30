import { createContext, useReducer } from "react";
import { LayoutMode, Global } from "./util";

const StoreContext = createContext();

const StoreAction = {
    RESET_BINDER: "RESET_BINDER",
    SET_LAYOUT: "SET_LAYOUT",
    SET_CARD: "SET_CARD",
    DELETE_CARD: "DELETE_CARD",
    SWAP_CARDS: "SWAP_CARDS",
    SET_CONTEXT_MENU: "SET_CONTEXT_MENU",
    DELETE_PAGE: "DELETE_PAGE"
};

function createCard(src, text) {
    return {
        src, text
    };
}

export function StoreContextProvider({children}) {
    const [store, dispatch] = useReducer(storeReducer, {
        layout: LayoutMode.BINDER,
        cards: new Array(Global.defaultBinderSize).fill(null),

        showContextMenu: false,
        contextMenuIndex: -1
    });

    function storeReducer(store, action) {
        const {type, payload} = action;
        switch(type) {
            case StoreAction.RESET_BINDER: {
                const newCards = new Array(Global.defaultBinderSize).fill(null);
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.SET_LAYOUT: {
                return {
                    ...store,
                    layout: payload.layout
                };
            }
            case StoreAction.SET_CARD: {
                const newCards = [...store.cards];
                newCards[payload.index] = createCard(payload.src, payload.text);
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.DELETE_CARD: {
                const newCards = [...store.cards];
                newCards[payload.index] = null;
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.SWAP_CARDS: {
                const newCards = [...store.cards];
                newCards[payload.srcIndex] = store.cards[payload.destIndex];
                newCards[payload.destIndex] = store.cards[payload.srcIndex];
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.DELETE_PAGE: {
                // deletes cards [payload.pageIndex*9 ... payload.pageIndex*9+8]
                const newCards = [
                    ...store.cards.slice(0, payload.pageIndex*9),
                    ...store.cards.slice(payload.pageIndex*9+9)];
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.SET_CONTEXT_MENU: {
                return {
                    ...store,
                    contextMenuIndex: payload.index
                };
            }
            default:
                return;
        }
    }

    store.hasCard = (index) => {
        return store.cards[index] != null;
    };

    store.getNumCards = () => {
        return store.cards.length;
    };

    store.getCard = (index) => {
        return store.cards[index];
    }

    store.getCardSrc = (index) => {
        return store.cards[index]?.src;
    };

    store.getCardText = (index) => {
        return store.cards[index]?.text;
    }

    store.getLayout = () => {
        return store.layout;
    };

    store.setLayout = (layout) => {
        dispatch({
            type: StoreAction.SET_LAYOUT,
            payload: {layout}
        });
    };

    store.setCard = (index, src, text) => {
        dispatch({
            type: StoreAction.SET_CARD,
            payload: {index, src, text}
        })
    }

    store.deleteCard = (index) => {
        dispatch({
            type: StoreAction.DELETE_CARD,
            payload: {index}
        });
    };

    store.swapCards = (srcIndex, destIndex) => {
        dispatch({
            type: StoreAction.SWAP_CARDS,
            payload: { srcIndex, destIndex }
        });
    };

    store.deletePage = (pageIndex) => {
        dispatch({
            type: StoreAction.DELETE_PAGE,
            payload: {pageIndex}
        })
    }

    store.resetBinder = () => {
        dispatch({
            type: StoreAction.RESET_BINDER,
            payload: {}
        });
    };

    store.setContextMenu = (index) => {
        dispatch({
            type: StoreAction.SET_CONTEXT_MENU,
            payload: index
        })
    }

    store.hideContextMenu = () => {
        store.setContextMenu(-1);
    }

    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContext;