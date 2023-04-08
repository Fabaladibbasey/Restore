using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class ProductsController : BaseApiController
{
    private readonly StoreContext _context;

    public ProductsController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PageList<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = _context.Products
            .Where(p => p.QuantityInStock > 0)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .Sort(productParams.OrderBy)
            .AsQueryable();

        var products = await PageList<Product>.CreateAsync(query, productParams.PageNumber, productParams.PageSize);
        Response.AddPaginationHeader(products.MetaData);

        return products;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is null) return NotFound();
        return product;
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetProductFilters()
    {
        var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
        var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
        return Ok(new { brands, types });
    }

}
