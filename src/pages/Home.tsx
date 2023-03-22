import ProductCard from "../components/ProductCard";
import "../css/home.css";
import bckgrnd from "../images/pexels-ella-olsson-1640777.jpg";
const Home = () => {
    
      return (
        <div className="home-container" style={{display: 'flex', 
                    justifyContent: 'space-between', 
                    height: '100vh',
                    // backgroundImage: `url(${bckgrnd})`,width: "100%",
                    // backgroundSize: "100% auto",
                    // backgroundPositionY: '-160px',
                    
                    }}>
          <ProductCard/>
        </div>

        )
}; 

export default Home;