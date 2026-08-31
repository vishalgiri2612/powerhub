import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const rawCode = resolvedParams?.code || "";
    const cleanPin = rawCode.replace(/\D/g, "");

    if (!cleanPin || cleanPin.length !== 6) {
      return NextResponse.json(
        { error: "Invalid PIN code. Must be 6 digits.", success: false },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json"
      },
      next: { revalidate: 86400 } // Cache pincode lookups for 24h
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pincode details", success: false },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
      const po = data[0].PostOffice[0];
      const city = po.District || po.Division || po.Block || "";
      const state = po.State || "";
      return NextResponse.json({
        success: true,
        city,
        state,
        postOffice: po.Name || ""
      });
    }

    return NextResponse.json(
      { error: "No location details found for this PIN code.", success: false },
      { status: 404 }
    );
  } catch (err) {
    console.error("[PINCODE_API_ERROR]", err);
    return NextResponse.json(
      { error: "PIN code lookup service unavailable", success: false },
      { status: 500 }
    );
  }
}
