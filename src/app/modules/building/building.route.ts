import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import authGuard from "../../middlewares/authGuard";
import queryParams from "../../middlewares/queryParams";
import validateRequest from "../../middlewares/validateRequest";

import { BuildingController } from "./building.controller";
import {
  createBuildingZodSchema,
  updateBuildingZodSchema,
} from "./building.validation";

const router = express.Router();

router.post(
  "/",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createBuildingZodSchema),
  BuildingController.createBuilding
);

router.get("/", queryParams, BuildingController.getAllBuilding);
router.get("/:id", BuildingController.getSingleBuilding);

router.patch(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateBuildingZodSchema),
  BuildingController.updateBuilding
);
router.delete(
  "/:id",
  authGuard(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.deleteBuilding
);

export const BuildingRoutes = router;
