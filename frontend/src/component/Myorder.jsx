import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import './style/Myorder.css';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [orderReady, setOrderReady] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state.userId;
  console.log(userId);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'Orders');
        const q = query(ordersCollection, where('UserID', '==', userId), where('OrderStatus', '==', false));

        onSnapshot(q, (querySnapshot) => {
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (orderReady) {
      const timer = setTimeout(() => setOrderReady(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [orderReady]);

  useEffect(() => {
    const checkOrderStatus = () => {
      const ordersCollection = collection(db, 'Orders');
      const q = query(ordersCollection, where('UserID', '==', userId));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.OrderStatus === true) {
            setOrderReady(data.OrderID);
            setOrders(prevOrders => prevOrders.filter(order => order.OrderID !== data.OrderID));
          }
        });
      });
    };

    checkOrderStatus();
  }, [userId]);

  return (
    <div className="my-order">
      <header>
        <h1>My Orders</h1>
      </header>
      <section className="order-list">
        {orders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-item">
              <h3>Order #{order.OrderID}</h3>
              <ul>
                {order.OrderItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="total">Total: ${order.Amount}</p>
              <p className="payment-status">Payment Status: {order.PaymentStatus ? 'Paid' : 'Unpaid'}</p>
              <p className="schedule-later">Schedule Later: {order.ScheduleLater ? 'Scheduled' : 'Not Scheduled'}</p>
              <p className="order-status">Order Status: {order.OrderStatus ? 'Order Ready' : 'Not Ready'}</p>
            </div>
          ))
        )}
      </section>
      {orderReady && <div className="order-ready-popup">Order #{orderReady} is ready!</div>}
    </div>
  );
};

export default MyOrder;
