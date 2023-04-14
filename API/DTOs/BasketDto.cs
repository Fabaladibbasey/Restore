namespace API.DTOs;

public class BasketDto
{
    public int Id { get; set; }
    public List<BasketItemDto> Items { get; set; } = new List<BasketItemDto>();
    public string BuyerId { get; set; }
    public decimal subTotal { get; set; }
    public string PaymentIntentId { get; set; }
    public string ClientSecret { get; set; }

}
