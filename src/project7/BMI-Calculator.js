import "./BMI-Calculator.css";
import {useMemo, useState} from "react";

const DEFAULT_WEIGHT = 70;
const DEFAULT_HEIGHT = 170;

export default function BMICalculator() {
    const [height, setHeight] = useState(DEFAULT_HEIGHT);
    const [weight, setWeight] = useState(DEFAULT_WEIGHT);

    function onHeightChange(event) {
        const inputHeight = event.target.value;
        setHeight(inputHeight);
    }

    function onWeightChange(event) {
        const inputWeight = event.target.value;
        setWeight(inputWeight);
    }

    const output = useMemo(() => {
        const calculatedHeight = height / 100;
        return (weight / (calculatedHeight * calculatedHeight)).toFixed(1);
    }, [weight, height]);

    return (
        <main>
            <h1>Project 7: BMI CALCULATOR</h1>
            <div className={"input-section"}>
                <p className={"slider-output"}>Weight: {weight} kg</p>
                <input
                    className={"input-slider"}
                    onChange={onWeightChange}
                    type={"range"}
                    step={"1"}
                    min={"40"}
                    max={"220"}
                />
                <p className={"slider-output"}>Height: {height} cm</p>
                <input
                    className={"input-slider"}
                    onChange={onHeightChange}
                    type={"range"}
                    step={"1"}
                    min={"140"}
                    max={"220"}
                />
            </div>
            <div className={"output-section"}>
                <p>Your BMI is <p className={"output"}>{output}</p></p>
            </div>
        </main>
    );
}