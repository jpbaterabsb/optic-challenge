import React from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Authenticator } from "./Components/Authenticator";
import { Home } from "./Pages/Home";
import { Login } from "./Pages/Login";
import { Voters } from "./Pages/Voters";
import { Options } from "./Pages/Options";
import { StartVoting } from "./Pages/StartVoting";
import { Voting } from "./Pages/Voting";
import { VotingResults } from "./Pages/VotingResults";

const router = createBrowserRouter([
  {
    path: "/",
    element:  <Authenticator target={<Home/>} />,
    
  },
  {
    path: "/voting-results",
    element:  <VotingResults />,
    
  },
  {
    path: '/voting',
    element: <Voting />
  },
  {
    path: "/login",
    element:  <Login/>,
  },
  {
    path: "/voters",
    element: <Authenticator target={<Voters/>} />
  },
  {
    path: "/options",
    element: <Authenticator target={<Options/>} />
  },
  {
    path: "/start-voting",
    element: <Authenticator target={<StartVoting/>} />
  }
]);

export const Router: React.FC = () =>  <RouterProvider router={router} />
