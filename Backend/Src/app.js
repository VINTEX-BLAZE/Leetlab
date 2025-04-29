// Importing required Modules
import cookieParser from "cookie-parser";
import express from "express";
import HealthCheckRoutes from "./APP/Healthcheck/Health.Route.js"
import AuthRoutes from './APP/User (Auth)/Auth.Route.js'
const App = express();

App.use(express.json());
App.use(cookieParser());
App.use(express.urlencoded({ extended: true }));

// Setting Up Routes here

App.use("/api/v1/healthcheck", HealthCheckRoutes)
App.use("/api/v1/users", AuthRoutes)

export default App;
