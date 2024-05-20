import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, Timestamp, where, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import './style/Support.css';

const Support = () => {
  const [queries, setQueries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [queryForm, setQueryForm] = useState({ orderId: '', message: '' });
  const [showQueryForm, setShowQueryForm] = useState(null);
  const location = useLocation();
  const userId = location.state.userId;

  useEffect(() => {
    const fetchPreviousQueries = async () => {
      const supportQuery = query(collection(db, 'Support'), where('UserID', '==', userId));
      const supportSnapshot = await getDocs(supportQuery);
      const previousQueries = [];
      supportSnapshot.forEach(doc => {
        const data = doc.data();
        previousQueries.push({ id: doc.id, subject: data.Feedback || `Query for Order ${data.OrderID}`, message: data.Feedback || data.Query, date: data.time.toDate().toISOString().split('T')[0] });
      });
      setQueries(previousQueries);
    };

    const fetchUserOrders = async () => {
      const userOrdersQuery = query(collection(db, 'Orders'), where('UserID', '==', userId), where('OrderStatus', '==', false), orderBy('time', 'desc'));
      const userOrdersSnapshot = await getDocs(userOrdersQuery);
      const userOrders = [];
      userOrdersSnapshot.forEach(doc => {
        const data = doc.data();
        userOrders.push({ orderId: data.OrderID, items: data.OrderItems });
      });
      setOrders(userOrders);
    };

    fetchPreviousQueries();
    fetchUserOrders();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleQueryInputChange = (e) => {
    const { name, value } = e.target;
    setQueryForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFeedback = {
      Feedback: form.message,
      UserID: userId,
      SupportCheck: true,
      time: Timestamp.fromDate(new Date())
    };
    try {
      const docRef = await addDoc(collection(db, 'Support'), newFeedback);
      console.log('Feedback submitted with ID: ', docRef.id);
      setForm({ subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting feedback: ', error);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    const newQuery = {
      OrderID: queryForm.orderId,
      Query: queryForm.message,
      UserID: userId,
      SupportCheck: false,
      time: Timestamp.fromDate(new Date())
    };
    try {
      const docRef = await addDoc(collection(db, 'Support'), newQuery);
      console.log('Query submitted with ID: ', docRef.id);
      setShowQueryForm(null);
      setQueryForm({ orderId: '', message: '' });
    } catch (error) {
      console.error('Error submitting query: ', error);
    }
  };

  return (
    <div className="support">
      <header>
        <h1>Support</h1>
      </header>
      <div className="support-content">
        <section className="support-form">
          <h2>Submit Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit">Submit Feedback</button>
          </form>
        </section>
        <section className="orders">
          <h2>Placed Orders</h2>
          <ul>
            {orders.map(order => (
              <li key={order.orderId} className="order-item">
                <span>Order ID: {order.orderId}</span>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.name} - Quantity: {item.quantity}</li>
                  ))}
                </ul>
                <button onClick={() => setShowQueryForm(order.orderId)}>Query</button>
                {showQueryForm === order.orderId && (
                  <form onSubmit={handleQuerySubmit}>
                    <textarea
                      name="message"
                      value={queryForm.message}
                      onChange={handleQueryInputChange}
                      placeholder="Enter your query"
                      required
                    ></textarea>
                    <button type="submit">Submit Query</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="previous-feedback-queries">
        <h2>Previous Feedback and Queries</h2>
        {queries.length === 0 ? (
          <p>No previous feedback or queries.</p>
        ) : (
          <ul>
            {queries.map(query => (
              <li key={query.id} className="query-item">
                <h3>{query.subject}</h3>
                <p>{query.message}</p>
                <span className="date">{query.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Support;
