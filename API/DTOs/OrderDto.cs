using API.Entities.OrderAggregate;

namespace API.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public DateTime OrderDate { get; set; }
    public ShippingAddress ShipToAddress { get; set; }
    public int DeliveryFee { get; set; }
    public List<OrderItemDto> OrderItems { get; set; }
    public string Status { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Total { get; set; }
}
