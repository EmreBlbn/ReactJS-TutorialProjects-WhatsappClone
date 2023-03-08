import {createRoot} from "react-dom/client";

//Project 1
// import Gallery from "./project1/Gallery.js";

//Project 2
// import App from "./project2/App.js";

//Project 3
// import Quote from "./project3/Quote";

//Project 4
// import ShopList from "./project4/ShopList";

//Project 5
// import GitHub from "./project5/Github";

//Project 6
// import VideoPlayer from "./project6/VideoPlayer";

//Project 7
// import BMICalculator from "./project7/BMI-Calculator";

//Project 8
// import Pokemon from "./project8/Pokemon";

//Project 9
// import reportWebVitals from "./project9/ReportWebVitals";
// import "./project9/index.css";
// import PasswordGenerator from "./project9/PasswordGenerator";

//Project 10
import WhatsappApp from "./project10/WhatsappApp";
import "./project10/index.css";

import Airtable from "airtable";
import axios from "axios";

new Airtable({apiKey:'API_KEY'}).base('BASE_ID');
axios.defaults.baseURL =   'https://api.airtable.com/v0/appx04aPv2fM0sc3A/MESSAGES/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers['Authorization'] = 'Bearer patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725';

const root = document.querySelector("#react-root");

//Project 1
// createRoot(root).render(<Gallery/>);

//Project 2
// createRoot(root).render(<App/>);

//Project 3
// createRoot(root).render(<Quote/>);

//Project 4
// createRoot(root).render(<ShopList/>);

//Project 5
// createRoot(root).render(<GitHub/>);

//Project 6
// createRoot(root).render(<VideoPlayer/>);

//Project 7
// createRoot(root).render(<BMICalculator/>);

//Project 8
// createRoot(root).render(<Pokemon/>);

//Project 9
// createRoot(root).render(<PasswordGenerator/>)
// reportWebVitals();

//Project 10
createRoot(root).render(<WhatsappApp/>);