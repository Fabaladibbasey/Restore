using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly BasketServices _basketServices;
    private readonly StoreContext _context;

    public AccountController(UserManager<User> userManager, TokenService tokenService, BasketServices basketServices, StoreContext context)
    {
        _context = context;
        _basketServices = basketServices;
        _tokenService = tokenService;
        _userManager = userManager;
    }


    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users
            .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized("Invalid username or password");
        }

        var userBasket = await _basketServices.RetrieveBasket(user.UserName);
        var anonymousBasket = await _basketServices.RetrieveBasket(Request.Cookies["buyerId"]);

        if (anonymousBasket != null && userBasket != null)
        {
            foreach (var item in anonymousBasket.Items)
            {
                userBasket.AddItem(item.ProductId, item.Quantity);
            }
            _context.Baskets.Remove(anonymousBasket);
            Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }
        return new UserDto
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            Basket = userBasket.MapBasketToDto()
        };

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {

        var user = new User
        {
            UserName = registerDto.Username.ToLower(),
            Email = registerDto.Email.ToLower()
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        await _userManager.AddToRoleAsync(user, "Member");

        return StatusCode(201);
    }


    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> CurrentUser()
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        return new UserDto
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user)
        };
    }

}
