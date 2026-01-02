import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classType, quantity, bookingDetails } = body;

    // Define your prices
    const prices = {
      'first-class': 25000,  // $250 in cents
      'second-class': 10000,   // $100 in cents
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: classType === 'first-class' ? 'First Class Ticket' : 'Second Class Ticket',
              description: `Booking for ${bookingDetails.date} at ${bookingDetails.time}`,
            },
            unit_amount: prices[classType as keyof typeof prices],
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/booking/cancel`,
      metadata: {
        classType: classType,
        quantity: quantity.toString(),
        date: bookingDetails.date,
        time: bookingDetails.time,
        userId: bookingDetails.userId || 'guest',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}