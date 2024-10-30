import { Routes, HashRouter, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AllChatsPage from "./pages/AllChatsPage";

import LoginSigning from "./pages/LoginSigning";
import PrivateRoutes from "./utils/PrivateRoutes";
import AllUsers from "./pages/AllUsers";
import ApresentationPage from "./pages/ApresentationPage";

export default function RouterComponent() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/allUsers" element={<AllUsers />} />
          <Route path="/allChats" element={<AllChatsPage />} />
          <Route path="/chat/:contactID" element={<ChatPage />} />
        </Route>
        <Route path="/" element={<ApresentationPage />} />

        <Route path="/account/:accountType" element={<LoginSigning />} />
       
      </Routes>
    </HashRouter>
  );
}
