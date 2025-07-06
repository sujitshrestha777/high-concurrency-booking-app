import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {z} from "zod"

const createPaymentSchema = z.object({
  amount: z.number().min(50), // Minimum $0.50
  currency: z.string().default('usd'),
  bookingId: z.string().min(1),
  customerEmail: z.string().email(),
  metadata: z.record(z.string()).optional(),
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-03-02',
});
export async function POST(request:NextRequest) {

   try {
     const data= await  request.json()
     const validatedData = createPaymentSchema.parse(data)
 
     const paymentIntent=await stripe.paymentIntents.create({
        amount: validatedData.amount,
       currency: validatedData.currency,
       metadata: {
         bookingId: validatedData.bookingId,
         ...validatedData.metadata,
       },
       receipt_email: validatedData.customerEmail,
       automatic_payment_methods: {
         enabled: true,
       },
     })
 
     return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
       paymentIntentId: paymentIntent.id,
     })
   } catch (error) {
    console.log("Error while creating paymentIntent",error)
    if(error instanceof z.ZodError){
        return NextResponse.json(
            {error:"invalid request data ",details:error.errors},
            {status:400}
        )
    }
    return NextResponse.json(
     { error: 'Failed to create payment intent' },
      { status: 500 }
    )
   }
}