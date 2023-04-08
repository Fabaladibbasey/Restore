using API.Entities.OrderAggregate;

namespace API.DTOs;

public class UserDto
{
    public string Username { get; set; }
    public string Token { get; set; }
    public BasketDto Basket { get; set; }
    public UserAddress? UserAddress { get; set; }

}
