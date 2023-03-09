import ProductCard from "../components/ProductCard";
import "../css/home.css";
import FPImg from '../images/DALL·E 2023-03-06 09.28.20 - Green table with cut vegetables and tortillas, bird perspective, white fade.jpg';

const Home = () => {
    
      return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <ProductCard/>
          {/* <img src={FPImg} alt="" style={{float: 'right'}}/> */}
        </div>

        )
}; 

export default Home;