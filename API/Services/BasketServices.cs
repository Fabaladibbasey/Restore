using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class BasketServices
{
    private readonly StoreContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BasketServices(StoreContext context, IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    public async Task<Basket> RetrieveBasket(string? buyerId)
    {
        return await _context.Baskets
            .Include(b => b.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(b => b.BuyerId == buyerId) ?? CreateBasket(buyerId);

    }
    private Basket CreateBasket(string? buyerId)
    {

        if (string.IsNullOrEmpty(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(7)
            };
            _httpContextAccessor.HttpContext.Response.Cookies.Append("buyerId", buyerId, cookieOptions);

        }

        var basket = new Basket(buyerId);
        _context.Baskets.Add(basket);
        return basket;
    }
}
