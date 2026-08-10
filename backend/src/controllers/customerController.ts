import { Request, Response } from "express";
import User from "../models/User";

export const getCustomers = async (
  req: Request,
  res: Response
) => {
  try {
    const customers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch customers",
    });
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = await User.findById(req.params.id).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch customer",
    });
  }
};