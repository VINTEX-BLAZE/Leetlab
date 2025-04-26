// Importing required Modules
import express from "express";
import { HealthCheck } from "./Health.controller.js";

const HealthCheckRoutes = express.Router();

HealthCheckRoutes.get("/health", HealthCheck);

export default HealthCheckRoutes;
