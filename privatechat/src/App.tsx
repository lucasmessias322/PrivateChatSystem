import AuthProvider from "./Context/AuthContext";
import RouterComponent from "./RouterComponent";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <RouterComponent />
    </AuthProvider>
  );
}

export default App;
