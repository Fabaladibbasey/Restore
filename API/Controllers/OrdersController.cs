using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrdersController : BaseApiController
{
    private readonly StoreContext _context;
    public OrdersController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrdersForUser()
    {
        return await _context.Orders
            .ProjectOrderToOrderDto()
            .Where(o => o.BuyerId == User.Identity!.Name)
            .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrderById")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var order = await _context.Orders
            .ProjectOrderToOrderDto()
            .FirstOrDefaultAsync(o => o.Id == id && o.BuyerId == User.Identity!.Name);

        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        var username = User.Identity?.Name;
        var basket = await _context.Baskets
            .RetrieveBasketWithItems(username!)
            .FirstOrDefaultAsync();

        if (basket == null) return BadRequest("Basket not found");

        var items = basket.Items.Select(i =>
        {
            var productItemOrdered = new ProductItemOrdered
            {
                ProductItemId = i.ProductId,
                ProductName = i.Product.Name,
                PictureUrl = i.Product.PictureUrl
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = productItemOrdered,
                Price = i.Product.Price,
                Quantity = i.Quantity
            };
            i.Product.QuantityInStock -= i.Quantity;
            return orderItem;
        }).ToList();

        if (items.Count == 0) return BadRequest("Basket is empty");

        var subtotal = items.Sum(i => i.Price * i.Quantity);
        var deliveryFee = subtotal < 10000 ? 500 : 0;

        var order = new Order
        {
            BuyerId = username!,
            ShipToAddress = orderDto.ShippingAddress,
            OrderItems = items,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,

        };

        _context.Orders.Add(order);
        basket.Items.Clear();

        if (orderDto.SaveAddress)
        {
            var user = await _context.Users
                .Include(u => u.UserAddress)
                .FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null) return BadRequest("User not found");
            user.UserAddress = new UserAddress
            {
                FullName = orderDto.ShippingAddress.FullName,
                Address1 = orderDto.ShippingAddress.Address1,
                Address2 = orderDto.ShippingAddress.Address2,
                City = orderDto.ShippingAddress.City,
                State = orderDto.ShippingAddress.State,
                ZipCode = orderDto.ShippingAddress.ZipCode,
                PhoneNumber = orderDto.ShippingAddress.PhoneNumber,
                Country = orderDto.ShippingAddress.Country
            };
            _context.Users.Update(user);

        }

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtRoute("GetOrderById", new { id = order.Id }, order);

        return BadRequest("Problem creating order");
    }
}
