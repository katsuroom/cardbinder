import { useEffect, useContext } from 'react'
import '../css/style.css'
import CardPage from './CardPage';
import Toolbar from './Toolbar';

import StoreContext from '../store';
import ContextMenu from './ContextMenu';
import { Global } from '../util';

export default function App() {

    const { store } = useContext(StoreContext);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const numPages = store.getNumCards() / Global.cardsPerPage;
    const numPageGroups = Math.ceil(numPages / Global.pagesPerGroup);

    return (
        <>
        <Toolbar />
        <div
            style={{
                backgroundColor: "rgb(31, 31, 31)",
                minWidth: "fit-content"
            }}
        >
            {
                Array.from({length: numPageGroups}).map((_, i) =>
                    <div
                        key={i}
                        className="page-group"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            gap: "0.5em",
                            padding: "1em",
                            paddingTop: "3em",
                            paddingBottom: "3em",
                            width: "fit-content"
                        }}
                    >
                        {
                            Array.from({length: Math.min( Global.pagesPerGroup, numPages-(Global.pagesPerGroup*i) )}).map((_, j) =>
                                <CardPage key={i*Global.pagesPerGroup+j} num={i*Global.pagesPerGroup+j} />
                            )
                        }
                    </div>
                )
            }
            <ContextMenu />
        </div>
        </>
    )
}