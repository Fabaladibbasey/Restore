using API.Entities;
using Stripe;

namespace API.Services;

public interface IPaymentService
{
    Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket);
}

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;
    public PaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];

        var paymentIntentService = new PaymentIntentService();
        PaymentIntent paymentIntent = null;

        if (!String.IsNullOrEmpty(basket.PaymentIntentId))
        {
            paymentIntent = await paymentIntentService.GetAsync(basket.PaymentIntentId);
        }

        if (paymentIntent?.AmountReceived < 1)
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = basket.subTotal + basket.DeliveryFee
            };
            paymentIntent = await paymentIntentService.UpdateAsync(basket.PaymentIntentId, options);
        }
        else
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = basket.subTotal + basket.DeliveryFee,
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };

            paymentIntent = await paymentIntentService.CreateAsync(options);
        }

        return paymentIntent;
    }

}
