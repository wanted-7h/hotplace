import type { Request, Response } from "express";

export const hello = (req: Request, res: Response) => {
  res.status(200).json({ test: "hello world" });
};
