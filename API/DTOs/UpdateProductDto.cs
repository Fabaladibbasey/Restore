namespace API.DTOs;

public class UpdateProductDto : CreateProductDto
{
    public int Id { get; set; }
    public IFormFile? file { get; set; }
}
