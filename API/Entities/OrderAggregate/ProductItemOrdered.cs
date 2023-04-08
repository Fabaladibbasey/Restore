using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned]
public class ProductItemOrdered
{
    public int ProductItemId { get; set; }
    public string ProductName { get; set; }
    public string PictureUrl { get; set; }

}
