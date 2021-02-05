import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import ResultsContainer from "./components/ResultsContainer";
import SecondResultContainer from "./components/SecondResult";
import { Provider } from "react-redux";
import store from "./store";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Header />
                <ResultsContainer />
                <SecondResultContainer />
            </div>
        </Provider>
    );
}

export default App;
