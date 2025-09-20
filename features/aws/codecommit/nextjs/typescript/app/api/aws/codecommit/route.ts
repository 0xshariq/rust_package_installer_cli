import { NextResponse } from "next/server";
import { listRepositories, getRepository, createRepository, deleteRepository } from "@/lib/codeCommit";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("repositoryName");
  if (name) return NextResponse.json(await getRepository(name));
  return NextResponse.json(await listRepositories());
}

export async function POST(req: Request) {
  const { repositoryName, description } = await req.json();
  return NextResponse.json(await createRepository(repositoryName, description));
}

export async function DELETE(req: Request) {
  const { repositoryName } = await req.json();
  return NextResponse.json(await deleteRepository(repositoryName));
}
