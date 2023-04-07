import Modal from "react-modal";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import rema from "../images/2022-06-11.jpeg";
import takeaway from "../images/pexels-diego-pontes-2323398.jpg";
import { PlaceAddress } from "../types";
import AddressSelection from "./Searchbar";

// Define types for card data
interface CardData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

// Sample card data
const cards: CardData[] = [
  {
    title: "Dagligvarer",
    description: `Få dine dagligvarer levert på døren.
    Vi handler fra Rema 1000`,
    imageUrl: rema,
    linkUrl: "/dagligvarer",
  },
  {
    title: "Take-away",
    description: "Bestill fra dine favorittrestauranter i Mandal området. ",
    imageUrl: takeaway,
    linkUrl: "/takeaway",
  },
];

// Component implementation
const DeliveryView = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [address, setAddress] = useState(loc.state.address);
  const [price, setPrice] = useState(loc.state.distance);

  const handleCardClick = (linkUrl: string) => {
    navigate(linkUrl, { state: { address: address, distance: price } });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



    function handleAddressSelected(placeAddress: PlaceAddress, price: number) {
      setAddress(placeAddress.street + ", " + placeAddress.postalCode + " " + placeAddress.city);
      setPrice(price);
    }

    function handleValidAddress(validAddress: boolean) {
      if (validAddress) {
        handleCloseModal();
        console.log(price, address)
      }
    }

    Modal.setAppElement('#root');


  return (
    <Container>
      <DeliveryInfo>
        Leveres til: {address} <Button onClick={handleOpenModal}>Ny adresse</Button>
      </DeliveryInfo>
      <h1 style={{textAlign: 'center', color: '#3e6b00'}}>Hva vil du ha idag? </h1>
      <Cards>
        {cards.map((card) => (
          <CardContainer key={card.title} onClick={() => handleCardClick(card.linkUrl)}>
            <CardImage src={card.imageUrl} alt={card.title} />
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
            <CardButton>Bestill</CardButton>
          </CardContainer>
        ))}
      </Cards>
      {<Modal className="modal" isOpen={isModalOpen} onRequestClose={handleCloseModal} ><><button className="close-button" onClick={handleCloseModal}>X</button><AddressSelection onAddressSelected={handleAddressSelected} onValidAddress={handleValidAddress}/></></Modal>}
    </Container>
  );
};

// Styling
const Container = styled.div`
  color: #333;
  padding: 1rem;
`;

const DeliveryInfo = styled.div`
  margin: 4rem auto 2rem auto;
  text-align: center;
  line-height: 2;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
`;

const Button = styled.a`
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0.25rem;
  margin-left: 1rem;
  height: 30px;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 4rem;
  width: 80%;
  margin: 30px auto;
`;

const CardContainer = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  margin-top: 40px;
  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const CardTitle = styled.h2`
  margin: 0.5rem 0;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0;
`;

const CardButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
  cursor: pointer;
`;

export default DeliveryView;
