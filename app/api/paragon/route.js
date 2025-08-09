import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const data = await req.json();
    console.log(data);

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("Paragon API Error:", err);
    return new NextResponse(`Paragon API Error: ${err.message}`, {
      status: 400,
    });
  }
}
