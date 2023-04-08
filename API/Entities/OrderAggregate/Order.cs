namespace API.Entities.OrderAggregate;

public class Order
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public ShippingAddress ShipToAddress { get; set; }
    public int DeliveryFee { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal Subtotal { get; set; }
    public decimal GetTotal()
    {
        return Subtotal + DeliveryFee;
    }
}
