import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import './style/Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const cart = location.state.cart;
  const userId = location.state.userId;

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePayment = async (method) => {
    const orderId = `ORDER_${Math.random().toString(36).substr(2, 9)}`;
    const orderItems = cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    const amount = calculateTotal();
    const paymentStatus = true;
    const scheduleLaterTimestamp = scheduledTime
      ? Timestamp.fromDate(new Date(`${new Date().toDateString()} ${scheduledTime}`))
      : null;
    const currentTimestamp = Timestamp.fromDate(new Date());

    try {
      await addDoc(collection(db, 'Orders'), {
        OrderID: orderId,
        OrderItems: orderItems,
        UserID: userId,
        Amount: amount,
        PaymentMethod: method,
        PaymentStatus: paymentStatus,
        ScheduleLater: scheduleLaterTimestamp,
        OrderStatus: false,
        time: currentTimestamp
      });

      alert('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const scheduleLater = () => {
    setIsScheduling(true);
  };

  const handleTimeChange = (event) => {
    setScheduledTime(event.target.value);
  };

  const confirmSchedule = () => {
    if (scheduledTime) {
      setIsScheduling(false);
    } else {
      alert('Please select a time');
    }
  };

  const total = calculateTotal();

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <ul className="cart-items">
        {cart.map(item => (
          <li key={item.name} className="cart-item">
            <span>{item.name}</span>
            <span>{item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="total">
        <span>Total:</span>
        <span id="total-price">${total}</span>
      </div>
      <button onClick={scheduleLater} className="schedule-button">Schedule Later</button>
      <button onClick={() => handlePayment('GPay')} className="payment-button">Pay with GPay</button>
      <button onClick={() => handlePayment('PhonePe')} className="payment-button">Pay with PhonePe</button>
      <button onClick={() => handlePayment('Paytm')} className="payment-button">Pay with Paytm</button>

      {isScheduling && (
        <div className="schedule-container">
          <h3>Select a time to schedule</h3>
          <label htmlFor="schedule-time">Time:</label>
          <select id="schedule-time" value={scheduledTime} onChange={handleTimeChange}>
            <option value="">Select a time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="01:00">01:00 PM</option>
            <option value="02:00">02:00 PM</option>
            <option value="03:00">03:00 PM</option>
            <option value="04:00">04:00 PM</option>
          </select>
          <button className="confirm-button" onClick={confirmSchedule}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
