import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());

// 🔹 Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Beef Burger 🍔" },
            unit_amount: 1000, // $10
          },
          quantity: req.body.quantity || 1,
        },
      ],
      mode: "payment",
      success_url: "https://demo-payment-integration.netlify.app/success.html",
      cancel_url: "https://demo-payment-integration.netlify.app/cancel.html",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// 🔹 Home Route

// 🔹 Success Page
app.get("/success", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Successful</title>
      <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #a8edea, #fed6e3);
          font-family: Arial, sans-serif;
          margin: 0;
        }
        h1 {
          color: #2ecc71;
          font-size: 2.5rem;
          margin-top: 20px;
          text-align: center;
          animation: fadeIn 2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <lottie-player 
        src="https://assets7.lottiefiles.com/packages/lf20_jbrw3hcz.json"  
        background="transparent"  
        speed="1"  
        style="width: 220px; height: 220px;"  
        autoplay>
      </lottie-player>
      <h1>✅ Payment Successful!<br/>Thank you 🎉</h1>
    </body>
    </html>
  `);
});

// 🔹 Cancel Page
app.get("/cancel", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Cancelled</title>
      <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #fdfbfb, #ebedee);
          font-family: Arial, sans-serif;
          margin: 0;
        }
        h1 {
          color: #e74c3c;
          font-size: 2.2rem;
          margin-top: 20px;
          text-align: center;
          animation: fadeIn 2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <lottie-player 
        src="https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json"  
        background="transparent"  
        speed="1"  
        style="width: 200px; height: 200px;"  
        autoplay>
      </lottie-player>
      <h1>❌ Payment Cancelled<br/>Please try again.</h1>
    </body>
    </html>
  `);
});

// 🔹 Config Endpoint (for frontend)
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000/success"));
