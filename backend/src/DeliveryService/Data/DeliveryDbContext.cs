using Microsoft.EntityFrameworkCore;
using Shared.Models;

namespace DeliveryService.Data;

public class DeliveryDbContext : DbContext
{
    public DeliveryDbContext(DbContextOptions<DeliveryDbContext> options) : base(options) { }

    public DbSet<Delivery> Deliveries { get; set; }
    public DbSet<Rider> Riders { get; set; }
    public DbSet<Hub> Hubs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Delivery>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Status).HasConversion<string>();
            entity.OwnsOne(e => e.ProofOfDelivery);
        });

        modelBuilder.Entity<Rider>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Hub>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });
    }
}