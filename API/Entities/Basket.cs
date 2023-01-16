namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItem> Items { get; set; } = new();

    public Basket()
    {
    }

    public Basket(string buyerId)
    {
        BuyerId = buyerId;
    }


    public decimal subTotal
    {
        get
        {
            decimal total = 0;
            foreach (var item in Items)
            {
                total += item.Product.Price * item.Quantity;
            }
            return total;
        }
    }

    public void AddItem(int productId, int quantity = 1)
    {
        var item = Items.FirstOrDefault(x => x.ProductId == productId);
        if (item == null)
        {
            Items.Add(new BasketItem(productId, quantity));
        }
        else
        {
            item.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity = 1)
    {
        var item = Items.FirstOrDefault(x => x.ProductId == productId);
        if (item != null)
        {
            if (item.Quantity > quantity)
            {
                item.Quantity -= quantity;
            }
            else
            {
                Items.Remove(item);
            }
        }
    }



}
