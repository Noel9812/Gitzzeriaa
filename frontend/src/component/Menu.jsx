import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Import Firebase configuration
import './style/Menu.css';
import background from './Images/10-1.jpeg'

const Menu = () => {
  const [cart, setCart] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const  userId  = location.state.userId;
  console.log(userId)


  useEffect(() => {
    const fetchMenuItems = async () => {
      const menuItemsCollection = collection(db, 'Menu Items');
      const menuItemsSnapshot = await getDocs(menuItemsCollection);
      const menuItemsList = menuItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoodItems(menuItemsList);
    };

    fetchMenuItems();
  }, []);

  const addToCart = (itemName, price) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.name === itemName);
      if (itemIndex !== -1) {
        // Item exists, update quantity
        const updatedCart = prevCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        return updatedCart;
      } else {
        // Item does not exist, add new item
        return [...prevCart, { name: itemName, price, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.name === itemName);
      if (itemIndex !== -1) {
        const updatedCart = [...prevCart];
        if (updatedCart[itemIndex].quantity === 1) {
          // If quantity is 1, remove the item
          updatedCart.splice(itemIndex, 1);
        } else {
          // Otherwise, decrease the quantity
          updatedCart[itemIndex].quantity -= 1;
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const checkout = () => {
    navigate('/checkout', { state: { cart: cart, userId: userId } });
  };

  return (
    <>
    
      <header>
        <h1>Gitzzeria</h1>
        <nav className='mynav'>
        <button onClick={() => navigate('/myorder',{ state: { userId } })}>MyOrder</button>
        <button onClick={() => navigate('/support',{ state: { userId } })}>Support</button>
        <button onClick={() => navigate('/')}>Logout</button>
      </nav>
      </header>
    
  
      <section className="menu">

        {foodItems.map(item => (
          <div key={item.id} className="food-item">
            <img src={`https://via.placeholder.com/180x140.png?text=${item.ItemName}`} alt={`Delicious ${item.ItemName}`} />
            <h3>{item.ItemName}</h3>
            <p>{item.description}</p>
            <p className="price">${item.price}</p>
            <button className="add-to-cart" onClick={() => addToCart(item.ItemName, item.price)}>Add +</button>
          </div>
        ))}
      </section>
      <aside id="cart">
        <h4>My Cart</h4>
        <div id="cart-items">
          {cart.map(item => (
            <div key={item.name} className="cart-item">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>${item.price * item.quantity}</span>
              <button id="rmvbtn" onClick={() => removeFromCart(item.name)}>-</button>
            </div>
          ))}
        </div>
        <div className="total"><span>Total:</span> <span id="total-price">${total}</span></div>
        <button className="checkout-btn" onClick={checkout}>Checkout</button>
      </aside>
    </>
  );
};

export default Menu;

