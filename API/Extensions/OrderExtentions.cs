using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class OrderExtentions
{
    public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> orders)
    {
        return orders.Select(o => new OrderDto
        {
            Id = o.Id,
            OrderDate = o.OrderDate,
            BuyerId = o.BuyerId,
            ShipToAddress = o.ShipToAddress,
            DeliveryFee = o.DeliveryFee,
            Status = o.Status.ToString(),
            OrderItems = o.OrderItems.Select(i => new OrderItemDto
            {
                ProductId = i.ItemOrdered.ProductItemId,
                ProductName = i.ItemOrdered.ProductName,
                PictureUrl = i.ItemOrdered.PictureUrl,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList(),
            Subtotal = o.OrderItems.Sum(i => i.Price * i.Quantity),
            Total = o.GetTotal(),

        }).AsNoTracking();
    }
}
