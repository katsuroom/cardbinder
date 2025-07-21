import Card from "./Card";

export default function CardPage(props) {
    return (
        <div className="card-page">
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5em"
            }}>
                {Array.from({length: 9}).map((_, i) => <Card key={i} num={props.num*9 + i}/>)}
            </div>
            <div style={{
                color: "white"
            }}>
                <p style={{
                    marginBlockEnd: 0
                }}>{props.num}</p>
            </div>
        </div>
    );
}