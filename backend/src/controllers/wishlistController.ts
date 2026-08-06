import { Response } from "express";
import Wishlist from "../models/Wishlist";
import { AuthRequest } from "../middleware/authMiddleware";

/*
-----------------------------------------
GET WISHLIST
-----------------------------------------
*/

export const getWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let wishlist = await Wishlist.findOne({
      userId: req.userId,
    }).populate("items.productId");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch wishlist",
    });
  }
};

/*
-----------------------------------------
ADD TO WISHLIST
-----------------------------------------
*/

export const addToWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({
      userId: req.userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.userId,
        items: [],
      });
    }

    const exists = wishlist.items.some(
      (item) => item.productId.toString() === productId
    );

    if (!exists) {
      wishlist.items.push({
        productId,
      });
    }

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to add wishlist item",
    });
  }
};

/*
-----------------------------------------
REMOVE FROM WISHLIST
-----------------------------------------
*/

export const removeWishlistItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.userId,
    });

    if (!wishlist) {
      res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
      return;
    }

    wishlist.items = wishlist.items.filter(
      (item) =>
        item.productId.toString() !== req.params.productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to remove wishlist item",
    });
  }
};