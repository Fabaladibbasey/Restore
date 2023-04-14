namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItem> Items { get; set; } = new();
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }

    public Basket()
    {
    }

    public Basket(string buyerId)
    {
        BuyerId = buyerId;
    }


    public long subTotal
    {
        get
        {
            long total = 0;
            foreach (var item in Items)
            {
                total += item.Product.Price * item.Quantity;
            }
            return total;
        }
    }

    public long DeliveryFee => subTotal > 10000 ? 0 : 500;

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

    public int GetItemQuantity(int productId)
    {
        var item = Items.FirstOrDefault(x => x.ProductId == productId);
        if (item != null)
        {
            return item.Quantity;
        }
        return 0;
    }

}
