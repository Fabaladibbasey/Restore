using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class ProductsController : BaseApiController
{
    private readonly StoreContext _context;
    private readonly IMapper _mapper;
    private readonly ImageService _imageService;

    public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
    {
        _imageService = imageService;
        _mapper = mapper;
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        if (productDto.file != null)
        {
            var imageUploadResult = await _imageService.AddPhotoAsync(productDto.file);
            if (imageUploadResult.Error != null)
                return BadRequest(new ProblemDetails { Title = imageUploadResult.Error.Message });

            product.PictureUrl = imageUploadResult.SecureUrl.AbsoluteUri;
            product.PublicId = imageUploadResult.PublicId;
        }
        _context.Products.Add(product);
        var result = await _context.SaveChangesAsync();
        if (result > 0) return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        return BadRequest(new ProblemDetails { Title = "Failed to create product" });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
    {
        var product = await _context.Products.FindAsync(productDto.Id);
        if (product is null) return NotFound();
        if (productDto.file != null)
        {
            var imageUploadResult = await _imageService.AddPhotoAsync(productDto.file);
            if (imageUploadResult.Error != null)
                return BadRequest(new ProblemDetails { Title = imageUploadResult.Error.Message });
            if (product.PublicId != null)
            {
                var deleteResult = await _imageService.DeletePhotoAsync(product.PublicId);
                if (deleteResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = deleteResult.Error.Message });
            }

            product.PictureUrl = imageUploadResult.SecureUrl.AbsoluteUri;
            product.PublicId = imageUploadResult.PublicId;
        }
        _mapper.Map(productDto, product);
        var result = await _context.SaveChangesAsync();
        if (result > 0) return Ok(product);
        return BadRequest(new ProblemDetails { Title = "Failed to update product" });

    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is null) return NotFound();
        if (!string.IsNullOrEmpty(product.PublicId))
        {
            var deleteResult = await _imageService.DeletePhotoAsync(product.PublicId);
            if (deleteResult.Error != null)
                return BadRequest(new ProblemDetails { Title = deleteResult.Error.Message });
        }
        _context.Products.Remove(product);
        var result = await _context.SaveChangesAsync();
        if (result > 0) return NoContent();
        return BadRequest(new ProblemDetails { Title = "Failed to delete product" });
    }
}
