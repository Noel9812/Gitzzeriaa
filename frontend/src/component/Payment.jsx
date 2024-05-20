import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Adjust the import path as needed
import { collection, getDocs } from 'firebase/firestore';
import './style/Payment.css';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentCollection = collection(db, 'Orders');
        const paymentSnapshot = await getDocs(paymentCollection);
        const paymentList = paymentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPayments(paymentList);
      } catch (error) {
        console.error('Error fetching payments: ', error);
      }
    };

    fetchPayments();
  }, []);

  const getPaymentStatus = (payment) => {
    return payment.PaymentStatus ? 'Paid' : 'Pending';
  };

  return (
    <div className="payment-page">
      <h1>Payments</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.OrderID}</td>
              <td>{getPaymentStatus(payment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentPage;
