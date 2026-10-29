import { NextResponse } from "next/server";
import { createResultPdf } from "@/controllers/result.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ index: string }> }) {
  const { index } = await params;
  const pdf = await createResultPdf(index);

  if (pdf.status === "invalid") {
    return NextResponse.json({ error: "Enter a valid index number." }, { status: 400 });
  }
  if (pdf.status === "not_found") {
    return NextResponse.json({ error: "No result found for this index number." }, { status: 404 });
  }

  return new NextResponse(pdf.bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
