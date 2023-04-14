using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class BasketExtentions
{

    public static BasketDto MapBasketToDto(this Basket basket)
    {
        var basketDto = new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            PaymentIntentId = basket.PaymentIntentId,
            ClientSecret = basket.ClientSecret,
            Items = basket.Items.Select(i => new BasketItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Price = i.Product.Price,
                PictureUrl = i.Product.PictureUrl,
                Quantity = i.Quantity,
                Brand = i.Product.Brand,
                Type = i.Product.Type,
                QuantityInStock = i.Product.QuantityInStock

            }).ToList(),
            subTotal = basket.subTotal
        };

        return basketDto;
    }

    public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query, string buyerId)
    {
        return query
            .Include(b => b.Items)
            .ThenInclude(p => p.Product)
            .Where(b => b.BuyerId == buyerId);
    }


}
