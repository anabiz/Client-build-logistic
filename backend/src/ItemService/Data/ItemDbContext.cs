using Microsoft.EntityFrameworkCore;
using Shared.Models;

namespace ItemService.Data;

public class ItemDbContext : DbContext
{
    public ItemDbContext(DbContextOptions<ItemDbContext> options) : base(options) { }

    public DbSet<Item> Items { get; set; }
    public DbSet<Batch> Batches { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Status).HasConversion<string>();
            entity.HasIndex(e => e.ItemNumber).IsUnique();
            entity.HasIndex(e => e.QrCode).IsUnique();
        });

        modelBuilder.Entity<Batch>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.HasIndex(e => e.BatchNumber).IsUnique();
        });
    }
}