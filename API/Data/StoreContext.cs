using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
public class StoreContext : IdentityDbContext<User, Role, int>
{
    public StoreContext(DbContextOptions<StoreContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder
            .Entity<User>()
            .HasOne(x => x.UserAddress)
            .WithOne()
            .HasForeignKey<UserAddress>(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<Role>()
            .HasData(
                    new Role
                    {
                        Id = 1,
                        Name = "Admin",
                        NormalizedName = "ADMIN"
                    },
                    new Role
                    {
                        Id = 2,
                        Name = "Member",
                        NormalizedName = "MEMBER"
                    });
    }

}
