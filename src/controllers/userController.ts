import type { Request, Response } from 'express';

import prisma from '../db/prisma.js';

const checkUsernameAvailability = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  res.status(200).json({ availability: !user });
};

export default {
  checkUsernameAvailability,
};
