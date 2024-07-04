using serverside_asp.Models;
using Microsoft.EntityFrameworkCore;


namespace serverside_asp.Repository {
    public class UserRepository: DbContext {
        public DbSet<User> users {get;set;}

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=localhost;uid=root;pwd=password;database=main;");
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity => {
                entity.ToTable("User");
                entity.HasKey(e => e.username);
                entity.Property(e => e.username).IsRequired();
                entity.Property(e => e.password).IsRequired();
            });
        }
    }
}