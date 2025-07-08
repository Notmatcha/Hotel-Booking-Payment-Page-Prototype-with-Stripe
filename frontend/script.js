const stripe = Stripe("pk_test_51RidTp09Hm6VCHXtcGjRbrAdCoCabLJssiPsixstWurIvIdOogNjsjAsPdkaxPVOjjcFHE4Gz6c4kIuGFuFZkBpJ00OwQhJRpA");

fetch("http://localhost:5000/create-payment-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 199, currency: "sgd" })  // SGD 1.99
})
.then(res => res.json())
.then(data => {
  const clientSecret = data.clientSecret;

  const elements = stripe.elements();
  const card = elements.create("card");
  card.mount("#card-element");

  const form = document.getElementById("payment-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: card }
    });

    document.getElementById("payment-message").textContent = error
      ? error.message
      : "Payment successful!";
  });
});
