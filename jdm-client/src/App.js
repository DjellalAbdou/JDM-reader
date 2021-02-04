import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import ResultsContainer from "./components/ResultsContainer";
import SecondResultContainer from "./components/SecondResult";

function App() {
    return (
        <div className="App">
            <Header />
            <ResultsContainer />
            <SecondResultContainer />
        </div>
    );
}

export default App;
