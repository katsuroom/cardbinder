import { useEffect } from 'react'
import '../css/style.css'
import CardPage from './CardPage';
import Toolbar from './Toolbar';

export default function App() {

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
    }, []);


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
                Array.from({length: 6}).map((_, i) =>
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
                            Array.from({length: 8}).map((_, j) =>
                                <CardPage key={i*8+j} num={i*8+j} />
                            )
                        }
                    </div>
                )
            }
        </div>
        </>
    )
}