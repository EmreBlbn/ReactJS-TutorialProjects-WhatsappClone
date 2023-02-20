import {useState} from "react";
import {toast, ToastContainer} from 'react-toastify';
import "./PasswordGenerator.css"
import 'react-toastify/dist/ReactToastify.css';

const COPY_SUCCESS = "Password successfully copied to clipboard";
const COPY_FAIL = "Password successfully copied to clipboard";

const numbers = '0123456789'
const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
const specialCharacters = "!'^+%&/()=?_#$½§{[]}|;:>÷`<.*-@é"

export default function PasswordGenerator() {

    const [password, setPassword] = useState("");
    const [passwordLength, setPasswordLength] = useState(13);
    const [includeUpperCase, setIncludeUpperCase] = useState(false);
    const [includeLowerCase, setIncludeLowerCase] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);

    const handleGeneratePassword = () => {
        if (!includeUpperCase && !includeLowerCase && !includeNumbers && !includeSymbols) {
            notify("To generate password you must select at least one checkbox", true);
        } else {
            let characterList = "";
            if (includeNumbers) {
                characterList = characterList + numbers;
            }
            if (includeUpperCase) {
                characterList = characterList + upperCaseLetters;
            }
            if (includeLowerCase) {
                characterList = characterList + lowerCaseLetters;
            }
            if (includeSymbols) {
                characterList = characterList + specialCharacters;
            }
            setPassword(createPassword(characterList));
            notify("Password is generated successfully", false);
        }
    }

    const createPassword = (characterList) => {
        let password = ""
        const characterListLength = characterList.length;
        for (let i = 0; i < passwordLength; i++) {
            const characterIndex = Math.round(Math.random() * characterListLength);
            password = password + characterList.substring(characterIndex, characterIndex + 1);
        }
        return password;
    }

    const copyToClipboard = (password) => {
        navigator.clipboard.writeText(password);
    }

    const notify = (message, hasError = false) => {
        if (hasError) {
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const handleCopyPassword = (e) => {
        if (password === "") {
            notify(COPY_FAIL, true);
        } else {
            copyToClipboard(password);
            notify(COPY_SUCCESS);
        }
    }

    return (
        <div className={"App"}>
            <div className={"container"}>
                <div className={"generator"}>
                    <h2 className={"generator__header"}>
                        Password Generator
                    </h2>
                    <div className={"generator__password"}>
                        <h3>{password}</h3>
                        <button className="copy__btn">
                            <i onClick={handleCopyPassword} className="fa"><p>&#128203;</p></i>
                        </button>
                    </div>
                    <div className={"form-group"}>
                        <label htmlFor={"password-strength"}>Password Length</label>
                        <input className={"pw"} defaultValue={passwordLength}
                               onChange={(e) => setPasswordLength(e.target.value)}
                               type="number" id="password-strength"
                               name="password-strength"
                               max="26" min="8"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="uppercase-letters">Add Uppercase Letters</label>
                        <input checked={includeUpperCase}
                               onChange={(e) => setIncludeUpperCase(e.target.checked)}
                               type="checkbox"
                               id="uppercase-letters" name="uppercase-letters"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lowercase-letters">Add Lowercase Letters</label>
                        <input checked={includeLowerCase}
                               onChange={(e) => setIncludeLowerCase(e.target.checked)}
                               type="checkbox"
                               id="lowercase-letters" name="lowercase-letters"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="include-numbers">Include Numbers</label>
                        <input checked={includeNumbers}
                               onChange={(e) => setIncludeNumbers(e.target.value)}
                               type="checkbox"
                               id="include-numbers" name="include-numbers"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="include-symbols">Include Symbols</label>
                        <input checked={includeSymbols}
                               onChange={(e) => setIncludeSymbols(e.target.value)}
                               type="checkbox"
                               id="include-symbols" name="include-symbols"/>
                    </div>

                    <button onClick={handleGeneratePassword} className="generator__btn">
                        Generate Password
                    </button>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </div>
        </div>
    );
}