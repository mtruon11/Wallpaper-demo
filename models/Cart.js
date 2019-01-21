module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: item.regularPrice}
        }
        storedItem.qty++;
        this.totalQty++;
        this.totalPrice += storedItem.price;
    }

    this.remove = function(id) {
        var deleteItem = this.items[id];
        this.totalQty -= deleteItem.qty;
        this.totalPrice -= deleteItem.price * deleteItem.qty;
        delete this.items[id];
    }

    this.update = function(qty, id) {
        this.totalQty -= this.items[id].qty; // Subtract old quantity
        this.totalPrice -= this.items[id].qty * this.items[id].price; //Subtract old total price
        this.items[id].qty = qty; //Update new quantity for that item
        this.totalQty += qty; // Update new total quantity
        this.totalPrice += this.items[id].qty * this.items[id].price; //Update new total price
    }

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}