import React, { useState } from 'react';
import '../css/InfoStyles.css';
import btmLeft from '../images/pexels-yaroslava-bondareva-10162244.jpg';
import topRight from '../images/pexels-julie-aagaard-1368520.jpg';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

const InfoComp: React.FC<Props> = ({ faqs }) => {
  const [openQuestion, setOpenQuestion] = useState('');

  return (
    <div className="four-part-container">
      <div className="top-left">
        <h1 style={{color: 'darkgreen'}}>Handlehjelpen Mandal</h1>
        <p>Handlehjelpen er en pålitelig og effektiv leveringsbedrift som henter dagligvarer og take away 
            fra lokale restauranter og bringer dem rett til døren din. Vi har som mål å gjøre 
            hverdagen din enklere ved å tilby rask og pålitelig levering av mat og dagligvarer 
            til en konkurransedyktig pris.
        </p>
        <h2 style={{color: 'darkgreen'}}>Våre tjenester inkluderer:</h2>
        <ul>
            <li>
                <strong style={{color: 'darkgreen'}}>Dagligvarelevering:</strong><br/>
                Vi tar hånd om alle dine daglige behov, fra fersk frukt og grønnsaker til melk og brød. 
                Vi sørger for at du har alt du trenger, når du trenger det. Vår samarbeidspartner er den billigste 
                dagligvarekjeden, Rema 1000. 
            </li>
            <br/>
            <li>
                <strong style={{color: 'darkgreen'}}>Take away-levering:</strong><br/>
                Vi henter også fra lokale restauranter og leverer maten rett til deg. 
                Enten du ønsker sushi, pizza eller thaimat, vi fikser det for deg.
            </li>
        </ul>

        <p>
            Vi tilbyr også fleksible betalingsalternativer. Du kan betale med kort eller vipps, betaling skjer ved levering av varene. 
            Vi ønsker å gjøre det så enkelt som mulig for deg å få levert mat og dagligvarer hjem til deg.
        </p>

      </div>
      <div className="top-right">
        <img src={topRight} alt="" />
      </div>
      <div className="bottom-left">
        <img src={btmLeft} alt="" />
      </div>
      <div className="bottom-right">
        <h1 style={{color: 'darkgreen'}}>Ofte Stilte Spørsmål</h1>
        {faqs.map(({ question, answer }) => (
          <div
            key={question}
            className={`faq-item${openQuestion === question ? ' open' : ''}`}
            onClick={() => setOpenQuestion(openQuestion === question ? '' : question)}
          >
            <div className="question">{question}</div>
            {openQuestion === question && <div className="answer">{answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoComp;
