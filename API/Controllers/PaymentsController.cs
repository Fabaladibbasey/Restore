using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController : BaseApiController
{
    private readonly IPaymentService _paymentService;
    private readonly StoreContext _context;
    private readonly IConfiguration _config;
    public PaymentsController(IPaymentService paymentService, StoreContext context, IConfiguration config)
    {
        _config = config;
        _context = context;
        _paymentService = paymentService;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        var basket = await _context.Baskets
                    .RetrieveBasketWithItems(User.Identity?.Name!)
                    .FirstOrDefaultAsync();

        if (basket == null) return BadRequest(new ProblemDetails { Detail = "Basket not found! Can't create or update payment intent" });

        var paymentIntent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

        if (paymentIntent == null) return BadRequest(new ProblemDetails { Detail = "Payment intent not found! Can't create or update payment intent" });

        if (!String.IsNullOrEmpty(paymentIntent.Id)) basket.PaymentIntentId = paymentIntent.Id;
        if (!String.IsNullOrEmpty(paymentIntent.ClientSecret)) basket.ClientSecret = paymentIntent.ClientSecret;

        _context.Baskets.Update(basket);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest(new ProblemDetails { Detail = "Problem updating basket with payment intent" });

        return Ok(basket.MapBasketToDto());
    }

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _config["StripeSettings:WebhookSecret"]);

        var charge = (Charge)stripeEvent.Data.Object;

        if (charge.Status == "succeeded")
        {
            var orders = await _context.Orders
                .FirstOrDefaultAsync(o => o.PaymentIntentId == charge.PaymentIntentId);

            if (orders == null && !charge.Refunded)
            {

                var refundService = new RefundService();
                var refundOptions = new RefundCreateOptions
                {
                    PaymentIntent = charge.PaymentIntentId,
                };
                var refund = await refundService.CreateAsync(refundOptions);

                var basket = await _context.Baskets
                    .RetrieveBasketWithItems(User.Identity?.Name!)
                    .FirstOrDefaultAsync();

                if (basket == null) return BadRequest(new ProblemDetails { Detail = "Basket not found! Payment refunded" });

                basket.PaymentIntentId = "";
                basket.ClientSecret = "";

                _context.Baskets.Update(basket);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return BadRequest(new ProblemDetails { Detail = "Problem updating basket with payment intent" });

                return BadRequest(new ProblemDetails { Detail = "Order not found! Payment refunded" });
            }
            else
            {
                orders!.Status = OrderStatus.PaymentReceived;
                _context.Orders.Update(orders);
                await _context.SaveChangesAsync();
            }
        }

        return new EmptyResult();
    }
}
