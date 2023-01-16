namespace API.DTOs;

public class BasketItemDto
{

    public int Quantity { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal Price { get; set; }
    public string PictureUrl { get; set; }
    public string Brand { get; set; }
    public string Type { get; set; }

}
