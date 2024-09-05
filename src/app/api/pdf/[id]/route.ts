import { getPDF } from "@/lib/db/books";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string }}
) {
  const id = params.id
  try {
    const pdf = await getPDF(Number(id))
    return new NextResponse(
      pdf,
      {
        headers: {
          "Content-Type": "application/pdf"
        },
        status: 200
      }
    )
  } catch (e) {
    return new NextResponse("not found", { status: 404 })
  }

}
