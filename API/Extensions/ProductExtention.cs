using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class ProductExtention
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        return orderBy switch
        {
            "priceAsc" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brand, string? type)
    {
        var brands = brand?.ToLower().Split(',') ?? new string[0];
        var types = type?.ToLower().Split(',') ?? new string[0];

        if (brands.Length > 0)
        {
            query = query.Where(p => brands.Contains(p.Brand.ToLower()));
        }

        if (types.Length > 0)
        {
            query = query.Where(p => types.Contains(p.Type.ToLower()));
        }

        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            query = query
                .Where(p => p.Name.ToLower()
                .Contains(search.ToLower()) || p.Description.ToLower()
                .Contains(search.ToLower()));
        }

        return query;
    }


    public static BasketDto MapBasketToDto(this Basket basket)
    {
        var basketDto = new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = basket.Items.Select(i => new BasketItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Price = i.Product.Price,
                PictureUrl = i.Product.PictureUrl,
                Quantity = i.Quantity,
                Brand = i.Product.Brand,
                Type = i.Product.Type

            }).ToList(),
            subTotal = basket.subTotal
        };

        return basketDto;
    }

}
