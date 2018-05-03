import styles from './Button.css';

console.log(styles);
const Button = document.createElement('div')
Button.innerHTML = `<button class="btn ${styles.primary}">Submit</button>`

export default Button

