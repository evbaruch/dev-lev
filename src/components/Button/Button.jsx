import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import styles from "./Button.module.css"; // Import the CSS module

function Button(props) {
  return (
    <Link to={props.link} className={styles.button}>
      <div className={styles.image}>
        <img src={props.image} alt={props.description} />
      </div>
      <div className={styles.textContent}>
        <h3>{props.text}</h3>
        <p className={styles.description}>{props.description}</p>
        <div className={styles.contributors}>
          {props.contributors.map((contributor, index) => (
            <img
              key={index}
              src={contributor}
              alt={`Contributor ${index + 1}`}
              className={styles.contributorImage}
            />
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.footerItem}>Likes: {props.likes}</span>
          <span className={styles.footerItem}>Views: {props.views}</span>
          <span className={styles.footerItem}>Comments: {props.comments}</span>
        </div>
      </div>
    </Link>
  );
}

// Define PropTypes for the Button component
Button.propTypes = {
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.string).isRequired,
  likes: PropTypes.number.isRequired,
  views: PropTypes.number.isRequired,
  comments: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
};

export default Button;