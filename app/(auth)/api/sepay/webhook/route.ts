import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const payload = await request.json();

    // Validate required fields
    if (!payload.id || !payload.transferAmount || !payload.transferType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Process the payment information
    const {
      id,
      gateway,
      transactionDate,
      accountNumber,
      code,
      content,
      transferType,
      transferAmount,
      accumulated,
      subAccount,
      referenceCode,
      description,
    } = payload;

    // Store transaction in database

    // Return success response
    return NextResponse.json(
      { success: true, message: "Transaction processed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing SePay webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
