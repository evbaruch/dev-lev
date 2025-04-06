import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./GenericPage.module.css";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookies";

export default function GenericPage(props) {
  const [likes, setLikes] = useState(props.likes);
  const [views, setViews] = useState(props.views);
  const [comments, setComments] = useState(props.comments || []);
  const [newComment, setNewComment] = useState("");

  const viewCookieName = `viewed_page_${props.pageId}`;
  const likeCookieName = `liked_page_${props.pageId}`;

  // Increment views when the page is loaded (only once per user)
  useEffect(() => {
    if (!getCookie(viewCookieName)) {
      const updatedViews = views + 1;
      setViews(updatedViews);
      setCookie(viewCookieName, true, 30); // Set a cookie for 30 days
      props.onUpdatePageData(props.pageId, { views: updatedViews });
      updatePageData(props.pageId, { views: updatedViews });
    }
  }, []);

  const updatePageData = async (id, updates) => {
    try {
      const response = await fetch("http://localhost:5000/api/updatePageData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update page data.");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error updating page data:", error.message);
    }
  };

  const handleLike = () => {
    if (getCookie(likeCookieName)) {
      // Unlike the page
      const updatedLikes = likes - 1;
      setLikes(updatedLikes);
      deleteCookie(likeCookieName); // Remove the like cookie
      props.onUpdatePageData(props.pageId, { likes: updatedLikes });
      updatePageData(props.pageId, { likes: updatedLikes });
    } else {
      // Like the page
      const updatedLikes = likes + 1;
      setLikes(updatedLikes);
      setCookie(likeCookieName, true, 30); // Set a cookie for 30 days
      props.onUpdatePageData(props.pageId, { likes: updatedLikes });
      updatePageData(props.pageId, { likes: updatedLikes });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setNewComment("");
      props.onUpdatePageData(props.pageId, { comments: updatedComments });
      updatePageData(props.pageId, { comments: updatedComments });
    }
  };

  const sections = [
    ...props.images.map((item) => ({ type: "image", ...item })),
    ...props.texts.map((item) => ({ type: "text", ...item })),
    ...props.contributors.map((item) => ({ type: "contributor", ...item })),
  ].sort((a, b) => a.index - b.index);

  return (
    <div className={styles.genericPage}>
      <header className={styles.header}>
        <h1>Generic Page</h1>
      </header>

      <div className={styles.sections}>
        {sections.map((section, index) => {
          if (section.type === "image") {
            return (
              <div
                key={index}
                className={`${styles.section} ${styles.imageSection}`}
              >
                <img src={section.url} alt={section.title} />
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>
            );
          } else if (section.type === "text") {
            return (
              <div
                key={index}
                className={`${styles.section} ${styles.textSection}`}
              >
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </div>
            );
          } else if (section.type === "contributor") {
            return (
              <div
                key={index}
                className={`${styles.section} ${styles.contributorSection}`}
              >
                <img src={section.url} alt={section.name} />
                <h4>{section.name}</h4>
                <p>{section.description}</p>
              </div>
            );
          }
          return null;
        })}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerItem} onClick={handleLike}>
          <span className={styles.icon}>👍</span> {likes}
        </div>
        <div className={styles.footerItem}>
          <span className={styles.icon}>👁️</span> {views}
        </div>
        <div className={styles.footerItem}>
          <span className={styles.icon}>💬</span> {comments.length}
        </div>
      </footer>

      <div className={styles.commentSection}>
        <h3>Comments</h3>
        <div className={styles.commentInput}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment}>Send</button>
        </div>
        <div className={styles.commentList}>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              {comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

GenericPage.propTypes = {
  pageId: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      index: PropTypes.number.isRequired,
    })
  ).isRequired,
  texts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
    })
  ).isRequired,
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
    })
  ).isRequired,
  likes: PropTypes.number.isRequired,
  views: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdatePageData: PropTypes.func.isRequired,
};