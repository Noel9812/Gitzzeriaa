import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import './style/Queries.css';

const Queries = () => {
  const [feedback, setFeedback] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackAndQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        const supportCollection = collection(db, 'Support');
        const feedbackQuery = query(supportCollection, where('UserID', '!=', 'admin@gmail.com'));
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const feedbackList = [];
        const queryList = [];

        feedbackSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.SupportCheck) {
            feedbackList.push({ id: doc.id, ...data });
          } else {
            queryList.push({ id: doc.id, ...data });
          }
        });

        setFeedback(feedbackList);
        setQueries(queryList);
      } catch (error) {
        setError('Error fetching feedback and queries. Please try again later.');
        console.error('Error fetching feedback and queries: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackAndQueries();
  }, []);

  return (
    <div className="queries-container">
      <header>
        <div className="branding">
          <h1>Support</h1>
        </div>
      </header>

      <div className="support-sections">
        {loading ? (
          <div className="loading">Loading feedback and queries...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <section className="feedback-section">
              <h2>Feedback</h2>
              {feedback.length === 0 ? (
                <p>No feedback available.</p>
              ) : (
                <ul>
                  {feedback.map(item => (
                    <li key={item.id} className="feedback-item">
                      <h3>{item.Feedback}</h3>
                      <p><strong>UserID:</strong> {item.UserID}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="query-section">
              <h2>Order Queries</h2>
              {queries.length === 0 ? (
                <p>No order queries available.</p>
              ) : (
                <ul>
                  {queries.map(item => (
                    <li key={item.id} className="query-item">
                      <h3>Order ID: {item.OrderID}</h3>
                      <p>{item.Query}</p>
                      <p><strong>UserID:</strong> {item.UserID}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Queries;
