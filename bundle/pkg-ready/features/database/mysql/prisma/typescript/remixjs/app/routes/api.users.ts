import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma";

export const loader: LoaderFunction = async () => {
  const users = await prisma.user.findMany();
  return json(users);
};
