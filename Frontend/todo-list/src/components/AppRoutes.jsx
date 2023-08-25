import { Route, Routes } from "react-router-dom";

import ToDoList from "./ToDoList";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";

import { useCurrentUser } from "$/hooks/useCurrentUser";

export default function AppRoutes() {
    return (
        <Routes>
            <Route exact path="/" element={<ToDoList />} />
            <Route exact path="/auth/login" element={<LoginPage />} />
            <Route exact path="/auth/register" element={<RegistrationPage />} />
        </Routes>
    );
}