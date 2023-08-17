//pages import
import './App.css';
import MainRoutes from "./routes/mainroutes";
import SearchComponent from "./components/searchcomponent"
import store from "./redux/store";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Toaster } from "react-hot-toast";

const Store = createStore(store);
function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Provider store={Store}>
      <div className="App" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <MainRoutes />
      </div>
    </Provider>
    </>
  );
}

export default App;
