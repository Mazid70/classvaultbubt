import App from "../App";
import CoverPageGenerator from "../pages/CoverPage/CoverPageGenerator ";
import Home from "../pages/Home/Home";
import ForgetPass from "../pages/logger/ForgetPass";
import Register from "../pages/logger/Register";
import ResetPass from "../pages/logger/ResetPass";
import SignIn from "../pages/logger/SignIn";
import Profile from "../pages/Profile/Profile";
import DashBoard from "../pages/Dashboard/Main/DashBoard";
import { createBrowserRouter } from "react-router";
import Notes from "../pages/Notes/Notes";
import User from "../pages/Dashboard/Admin/User";
import PendingNotes from "../pages/Dashboard/Admin/PendingNotes";
import Dashboard from "../pages/Dashboard/Overview/Dashboard";
import MyNotes from "../pages/Dashboard/Main/MyNotes";
import AdminCr from "./AdminCr";
import ValidUser from "./ValidUser";
import Leaderboard from "../pages/LeaderBoard/LeaderBoard";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/register', element: <Register /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/signin/forgot-password', element: <ForgetPass /> },
      { path: '/reset-password/:id/:token', element: <ResetPass /> },
      { path: '/coverpage', element: <CoverPageGenerator /> },
      { path: '/notes', element: <Notes /> },
      { path: '/profile', element: <Profile /> },
      { path: '/leaderboard', element: <Leaderboard/> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ValidUser>
        <DashBoard />
      </ValidUser>
    ),
    children: [
      { path: '', element: <Dashboard /> },
      {
        path: 'users',
        element: (
          <AdminCr>
            <User />
          </AdminCr>
        ),
      },
      {
        path: 'pending-notes',
        element: (
          <AdminCr>
            <PendingNotes />
          </AdminCr>
        ),
      },
      { path: 'mynotes', element: <MyNotes /> },
    ],
  },
]);
