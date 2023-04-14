using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using API.Services;
using API.Extensions;

namespace API.Controllers;

public class BasketController : BaseApiController
{
    private readonly StoreContext _context;
    private readonly BasketServices _basketServices;

    public BasketController(StoreContext context, BasketServices basketServices)
    {
        _basketServices = basketServices;
        _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await _basketServices.RetrieveBasket(GetBuyerId());
        return Ok(basket.MapBasketToDto());
    }

    [HttpPut]
    public async Task<ActionResult<BasketDto>> UpsertBasketItem(int productId, int quantity)
    {
        var basket = await _basketServices.RetrieveBasket(GetBuyerId());
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });
        if (product.QuantityInStock < (quantity + basket.GetItemQuantity(productId))) return BadRequest(new ProblemDetails { Title = "Not enough stock" });

        basket.AddItem(productId, quantity);
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

        return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });

    }


    [HttpDelete]
    public async Task<ActionResult> DeleteBasketItem(int productId, int quantity)
    {
        var basket = await _basketServices.RetrieveBasket(GetBuyerId());
        basket.RemoveItem(productId, quantity);
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();
        return BadRequest(new ProblemDetails { Title = "Problem deleting item from basket" });

    }

    [HttpDelete("remove")]
    public async Task<ActionResult> RemoveBasket()
    {
        var basket = await _basketServices.RetrieveBasket(GetBuyerId());
        _context.Baskets.Remove(basket);
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();
        return BadRequest(new ProblemDetails { Title = "Problem deleting basket" });

    }

    private string? GetBuyerId()
    {
        return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }

}
