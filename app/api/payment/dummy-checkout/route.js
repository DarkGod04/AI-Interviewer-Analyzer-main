import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, planId, planName, amount, credits } = body;

    if (!email || !planId) {
      return NextResponse.json(
        { error: "Missing required fields (email or plan ID)" },
        { status: 400 }
      );
    }

    // 1. Simulate a payment gateway processing delay (1.5 seconds) to make it feel real
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 2. Generate a fake transaction/receipt ID
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const transactionId = `dummy_tx_${randomHash}`;

    // Normally you would interact with Stripe/Razorpay APIs here,
    // and then update the database securely from your backend.
    
    // For this dummy project, since the frontend is already doing the
    // database credit updates, we just need to return a simulated success.

    return NextResponse.json({
      success: true,
      transactionId,
      message: `Successfully processed MOCK payment for ${planName} ($${amount})`,
      creditsRewarded: credits,
    });
  } catch (error) {
    console.error("Dummy Payment API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process dummy checkout" },
      { status: 500 }
    );
  }
}
