import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './style/Admin.css';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersCollection = collection(db, 'Orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = [];
        const scheduledOrdersList = [];
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          const order = { id: doc.id, ...data };
          if (!order.OrderStatus && order.ScheduleLater) {
            scheduledOrdersList.push(order);
          } else if (!order.OrderStatus) {
            ordersList.push(order);
          }
        });
        setOrders(ordersList);
        setScheduledOrders(scheduledOrdersList);
      } catch (error) {
        setError('Error fetching orders. Please try again later.');
        console.error('Error fetching orders: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderReady = async (orderId) => {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      await updateDoc(orderRef, { OrderStatus: true });
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setScheduledOrders(prevScheduledOrders => prevScheduledOrders.filter(order => order.id !== orderId));
      alert(`Order ${orderId} is ready`);
    } catch (error) {
      console.error('Error updating order status: ', error);
      alert('Error marking order as ready. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      await updateDoc(orderRef, { OrderStatus: false });
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setScheduledOrders(prevScheduledOrders => prevScheduledOrders.filter(order => order.id !== orderId));
      alert(`Order ${orderId} is canceled`);
    } catch (error) {
      console.error('Error canceling order: ', error);
      alert('Error canceling order. Please try again.');
    }
  };

  return (
    <div>
      <header>
        <div className="branding">
          <h1>Gitzzeria</h1>
        </div>
        <div className="mynav">
          <a href="/payments" className="nav-btn">Payments</a>
          <a href="/queries" className="nav-btn">Queries</a>
          <a href="/" className="nav-btn">Logout</a>
        </div>
      </header>

      <div className="admin-container">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="orders">
              <h2>Orders</h2>
              {orders.map((order) => (
                <div className="order-item" key={order.id}>
                  <div className="order-details">
                    <h3>{order.OrderID}</h3>
                    <p>Items:</p>
                    <ul>
                      {order.OrderItems.map((item, index) => (
                        <li key={index}>{item.name} - Quantity: {item.quantity}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="button-container">
                    <button className="button order-btn" onClick={() => handleOrderReady(order.id)}>Order Ready</button>
                    <button className="button cancel-btn" onClick={() => handleCancelOrder(order.id)}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="scheduled-orders">
              <h2>Scheduled Orders</h2>
              {scheduledOrders.map((order) => (
                <div className="order-item" key={order.id}>
                  <div className="order-details">
                    <h3>{order.OrderID}</h3>
                    <p>Items:</p>
                    <ul>
                      {order.OrderItems.map((item, index) => (
                        <li key={index}>{item.name} - Quantity: {item.quantity}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="button-container">
                    <button className="button order-btn" onClick={() => handleOrderReady(order.id)}>Order Ready</button>
                    <button className="button cancel-btn" onClick={() => handleCancelOrder(order.id)}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
