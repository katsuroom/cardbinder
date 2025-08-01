import { createContext, useReducer } from "react";
import { LayoutMode, Global } from "./util";

const StoreContext = createContext();

const StoreAction = {
    NEW_BINDER: "NEW_BINDER",
    NEW_GALLERY: "NEW_GALLERY",

    SET_CARD: "SET_CARD",
    SET_CARD_TEXT: "SET_CARD_TEXT",
    SET_PAGE_TEXT: "SET_PAGE_TEXT",
    DELETE_CARD: "DELETE_CARD",
    SWAP_CARDS: "SWAP_CARDS",

    DELETE_PAGE: "DELETE_PAGE",
    INSERT_PAGE: "INSERT_PAGE",
    CLEAR_PAGE: "CLEAR_PAGE",

    IMPORT_BINDER: "IMPORT_BINDER",
    IMPORT_GALLERY: "IMPORT_GALLERY"
};

export function StoreContextProvider({children}) {
    const [store, dispatch] = useReducer(storeReducer, {
        layout: LayoutMode.BINDER,
        cards: new Array(Global.defaultBinderSize).fill(null),
        pages: new Array(Global.defaultBinderSize / Global.cardsPerPage).fill(null)
    });

    function storeReducer(store, action) {
        const {type, payload} = action;
        switch(type) {
            case StoreAction.NEW_BINDER: {
                return {
                    ...store,
                    layout: LayoutMode.BINDER,
                    cards: new Array(Global.defaultBinderSize).fill(null),
                    pages: new Array(Global.defaultBinderSize / Global.cardsPerPage).fill(null)
                };
            }
            case StoreAction.NEW_GALLERY: {
                return {
                    ...store,
                    layout: LayoutMode.GALLERY,
                    cards: new Array(Global.defaultGallerySize).fill(null),
                    pages: new Array(Global.defaultGallerySize / Global.cardsPerPage).fill(null)
                };
            };
            case StoreAction.SET_CARD: {
                const newCards = [...store.cards];
                newCards[payload.index] = store.createCard(payload.src, payload.text);
                return {
                    ...store,
                    cards: newCards
                };
            };
            case StoreAction.SET_CARD_TEXT: {
                const newCards = [...store.cards];
                if(newCards[payload.index] == null)
                    newCards[payload.index] = store.createCard(null, payload.text);
                else
                    newCards[payload.index].text = payload.text;

                return {
                    ...store,
                    cards: newCards
                };
            };
            case StoreAction.SET_PAGE_TEXT: {
                const newPages = [...store.pages];
                newPages[payload.index] = payload.text;

                return {
                    ...store,
                    pages: newPages
                };
            };
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
                const newCards = [
                    ...store.cards.slice(0, payload.pageIndex*9),
                    ...store.cards.slice(payload.pageIndex*9+9)
                ];
                const newPages = [
                    ...store.pages.slice(0, payload.pageIndex),
                    ...store.pages.slice(payload.pageIndex+1)
                ];
                return {
                    ...store,
                    cards: newCards,
                    pages: newPages
                };
            }
            case StoreAction.INSERT_PAGE: {
                // add i*9 - (i+1)*9
                const newPage = new Array(Global.cardsPerPage).fill(null);
                const newCards = [
                    ...store.cards.slice(0, payload.pageIndex*9),
                    ...newPage,
                    ...store.cards.slice(payload.pageIndex*9)
                ];
                const newPages = [
                    ...store.pages.slice(0, payload.pageIndex),
                    null,
                    ...store.pages.slice(payload.pageIndex)
                ];
                return {
                    ...store,
                    cards: newCards,
                    pages: newPages
                };
            };
            case StoreAction.CLEAR_PAGE: {
                const newCards = [...store.cards];
                const newPages = [...store.pages];
                for(let i = 0; i < 9; ++i) {
                    newCards[payload.pageIndex*9 + i] = null;
                }
                newPages[payload.pageIndex] = null;

                return {
                    ...store,
                    cards: newCards,
                    pages: newPages
                };
            };
            case StoreAction.IMPORT_BINDER: {
                let newPages = payload.pages;
                if(newPages == null) {
                    newPages = new Array(payload.cards.length / Global.cardsPerPage).fill(null);
                }

                return {
                    ...store,
                    layout: LayoutMode.BINDER,
                    cards: payload.cards,
                    pages: newPages
                };
            }
            case StoreAction.IMPORT_GALLERY: {
                let newPages = payload.pages;
                if(newPages == null) {
                    newPages = new Array(payload.cards.length / Global.cardsPerPage).fill(null);
                }
                return {
                    ...store,
                    layout: LayoutMode.GALLERY,
                    cards: payload.cards,
                    pages: newPages
                };
            };
            default:
                return;
        }
    }

    store.createCard = (src, text) => {
        return {
            src, text
        };
    };

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
    };

    store.getPageText = (pageIndex) => {
        return store.pages[pageIndex];
    };

    store.getLayout = () => {
        return store.layout;
    };
    
    store.getPages = () => {
        console.log(store.pages);
    }

    store.setCard = (index, src, text) => {
        dispatch({
            type: StoreAction.SET_CARD,
            payload: {index, src, text}
        });
    };

    store.setCardText = (index, text) => {
        dispatch({
            type: StoreAction.SET_CARD_TEXT,
            payload: {index, text}
        });
    };

    store.setPageText = (index, text) => {
        dispatch({
            type: StoreAction.SET_PAGE_TEXT,
            payload: {index, text}
        });
    };

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
        });
    };

    store.insertPage = (pageIndex) => {
        dispatch({
            type: StoreAction.INSERT_PAGE,
            payload: {pageIndex}
        });
    };

    store.clearPage = (pageIndex) => {
        dispatch({
            type: StoreAction.CLEAR_PAGE,
            payload: {pageIndex}
        });
    };

    store.newBinder = () => {
        dispatch({
            type: StoreAction.NEW_BINDER,
            payload: {}
        });
    };

    store.newGallery = () => {
        dispatch({
            type: StoreAction.NEW_GALLERY,
            payload: {}
        });
    };

    store.importBinder = (cards, pages) => {
        dispatch({
            type: StoreAction.IMPORT_BINDER,
            payload: {cards, pages}
        });
    };

    store.importGallery = (cards, pages) => {
        dispatch({
            type: StoreAction.IMPORT_GALLERY,
            payload: {cards, pages}
        });
    };

    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContext;