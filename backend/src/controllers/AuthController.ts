import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login with JWT
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }
    const user = await User.findOne({
      username,
    });
    if (!user || (await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // sign JWT
    const accessToken = jwt.sign(
      { username: user.username, lastlogin: user.lastLogin },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    // create refresh token
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // return res.json({ token: accessToken });
    return res.json({ token: accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    user.lastLogout = new Date();
    await user.save();
    return res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
