import { useState } from "react";
import InfoComp from "../components/InfoComp";
import ProductCard from "../components/ProductCard";
import LocationSearchInput from "../components/Searchbar";
import AddressSelection from "../components/Searchbar";
import SearchBar from "../components/Searchbar";
import "../css/home.css";
import { PlaceAddress } from "../types";

const Home = () => {
    
  const faqs = [
      { question: 'Hva er deres leveringsområde?', answer: 'Vi leverer i en radius på 10 km fra Rema 1000 vestnes. Ved ønsker om levering utenfor dette ber vi deg kontakte oss på mail: kontakt@handlehjelpen.no så finner vi en ordning. ' },
      { question: 'Hvilke betalingsmåter aksepterer dere?', answer: 'Vi aksepterer kortbetaling og betaling ved vipps. Om du ønsker å betale kontant må du ha det nøyaktige beløpet da våre sjåfører sannsynligvis ikke har vekslepenger.' },
      { question: 'Når er deres leveringstider i påsken?', answer: 'Vi leverer hver dag i påsken og har leveringsalternativer som strekker seg fra "Før 09:00" til "19:00-21:00"' },
      { question: 'Når må jeg bestille for å få morgenlevering den påfølgende dagen? ', answer: 'Da må du bestille før kl 18:00 dagen før levering.'},
      { question: 'Hvor lang tid tar det å få levert maten eller dagligvarene? ', answer: 'Når du velger alternativer "Så fort som mulig" vil levering normalt skje innen 1 time. '},
      { question: 'Kan jeg endre bestillingen min etter at jeg har lagt den inn? ', answer: 'Nei, dette er en funksjon vi jobber med å tilrettelegge for. Om du ønsker å endre eller kansellere bestillingen må du kontakte oss på tlf: 489 12 203 eller mail: kontakt@handlehjelpen.no snarest. Ytterligere spesifikasjoner rundt kansellering finner du i Vilkårsavtalen under Avbestillings- og refusjonspolicy.'},
      { question: 'Hvordan kan jeg kontakte dere hvis jeg har spørsmål eller problemer med bestillingen min? ', answer: 'Du kan kontakte oss på tlf: 489 12 203 eller mail: kontakt@handlehjelpen.no.'},
      { question: 'Kan dere levere til flere adresser? ', answer: 'Nei, om du ønsker levering til flere adresser kan du legge inn separate bestillinger til hver adresse. '},
      { question: 'Hva skjer hvis jeg ikke er hjemme når dere leverer? ', answer: 'Har du lagt inn bestilling har du akseptert at du skal være tilgjengelig for mottak av bestilling. Er du ikke tilstede og heller ikke tilgjengelig vil du bli fakturert for hele beløpet og risikere å ikke få matvarene levert. '},
      { question: 'Tar dere imot spesialbestillinger eller allergier? ', answer: 'Allergier kan spesifiseres i bestillingen. Om du ønsker en bestilling av unormal størrelse eller skiller seg fra normale bestillinger kan du kontakte oss på mail: kontakt@handlehjelpen.no så finner vi en ordning sammen. '},
      { question: 'Kan jeg avbestille bestillingen min hvis det skulle oppstå endringer i planene mine? ', answer: 'Ja, avbestillinger kan gjøres på mail senest én time før planlagt levering. Skjer avbestillingen etter det vil du bli belastet for hele bestillingen.'},
    ];
  
    return (
      <>
        <div className="home-container" style={{display: 'flex', 
                    // justifyContent: 'space-between', 
                    height: '100vh',
                    borderBottom: '3px solid black'
                  }}>
          <ProductCard />
        </div>
        <InfoComp
          faqs={faqs}
        ></InfoComp>
      </>
      )
}; 

export default Home;