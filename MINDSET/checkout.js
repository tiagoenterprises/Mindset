
// backend/server.js

const express = require("express");
const app = express();
const stripe = require("stripe")("pk_test_51RKK1RH7iBEMqtBLdtuA6XnK32OS8UNZgDVJ1FlHa68LEECD5uSj4gqvy43qi0tFkKdYNuxGEhEc557Fg4W0fTm800nmdfidJn"); // <-- substitua pela sua secret key real
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/checkout-session", async (req, res) => {
  const { nome, email, endereco, cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Carrinho vazio." });
  }

  try {
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nome,
        },
        unit_amount: Math.round(item.preco * 100),
      },
      quantity: item.quantidade,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: "https://SEU_SITE/sucess.html",
      cancel_url: "https://SEU_SITE/cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Erro ao criar sessão Stripe:", error.message);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento." });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
