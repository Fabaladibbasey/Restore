using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController : BaseApiController
{
    private readonly StoreContext _context;

    public BasketController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();
        return Ok(MapBasketToDto(basket));
    }

    [HttpPut]
    public async Task<ActionResult<BasketDto>> UpsertBasketItem(int productId, int quantity)
    {
        var basket = await RetrieveBasket();
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        basket.AddItem(productId, quantity);
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

        return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });

    }


    [HttpDelete]
    public async Task<ActionResult> DeleteBasketItem(int productId, int quantity)
    {
        var basket = await RetrieveBasket();
        basket.RemoveItem(productId, quantity);
        var result = await _context.SaveChangesAsync() > 0;
        if (result && basket.Items.Any(_ => true)) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem deleting item from basket" });

    }


    private async Task<Basket> RetrieveBasket()
    {
        return await _context.Baskets
            .Include(b => b.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(b => b.BuyerId == Request.Cookies["buyerId"]) ?? CreateBasket();

    }

    private Basket CreateBasket()
    {
        var buyerId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.Now.AddDays(7)
        };

        Response.Cookies.Append("buyerId", buyerId, cookieOptions);

        var basket = new Basket(buyerId);
        _context.Baskets.Add(basket);
        return basket;

    }

    private BasketDto MapBasketToDto(Basket basket)
    {
        var basketDto = new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = basket.Items.Select(i => new BasketItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Price = i.Product.Price,
                PictureUrl = i.Product.PictureUrl,
                Quantity = i.Quantity,
                Brand = i.Product.Brand,
                Type = i.Product.Type

            }).ToList(),
            subTotal = basket.subTotal
        };

        return basketDto;
    }

}
