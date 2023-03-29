import { collection, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from '../context/DataContext';
import {firestore} from '../base';
import AdminPage from "../components/AdminPage";

const ProfilePage = ({ isAdmin }: { isAdmin: boolean }) => {
    const [data, setData] = useState<DocumentData>();
    const user = useContext(AuthContext);
    const navigate = useNavigate();
    
    async function getOrdersByOwner() {
        const ordersRef = collection(firestore, 'orders');
        const q = query(ordersRef, orderBy("mottatt", "desc"), where('ownerId', '==', user?.uid));
        const data = await getDocs(q);
        console.log(data.docs);
        return data.docs;
      }

      const [prevOrders, setPrevOrders] = useState<any>([]);

      useEffect(() => {
        if (user) {
          const userReference = doc(firestore, "users", user?.uid);
          const getUser = async () => {
            const retrievedData = await getDoc(userReference);
            setData(retrievedData.data());
          };
          getUser();
          const getPrevOrders = async () => {
            const orders = await getOrdersByOwner();
            setPrevOrders(orders);
          };
          getPrevOrders();
        }
      }, [user]);
      


    return (
        <div className="userProfile">
            {user?
                <>
                    <h1>Brukerinfo</h1>
                    <p><b>Navn:</b> {data?.navn}</p>
                    <p><b>Tlf:</b> {data?.tlf}</p>
                    <p><b>E-mail:</b> {data?.email}</p>
                    <p><b>Bruker-ID:</b> {user.uid}</p>
                    {/* <p>{prevOrders}</p> */}
                    <Link to="/">
                        <button className="submitBtn">Tilbake til hjemmesiden</button>      
                    </Link>
                    {prevOrders.length !== 0 &&
                    <div className="prevContainer">
                        <h1>Dine bestillinger</h1>
                        <table>
                            <thead>
                                <tr>
                                <th>Bestillingsdato</th>
                                <th>Leveringsdato</th>
                                <th>Leveringspris</th>
                                <th>Varer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prevOrders.map((order: any) => (
                                <tr key={order.id}>
                                    <td>{order.data().mottatt}</td>
                                    <td>{order.data().leveringstid === 'En annen dato' ? order.data().annenDato : order.data().leveringstid}</td>
                                    <td>{order.data().leveringspris} kr</td>
                                    <td>{order.data().varer.join(", ")}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    }
                </> 
                : 
                <>
                    <h1>Logget ut </h1>
                    <Link to="/">
                        <button className="submitBtn">Tilbake til hjemmesiden</button>      
                    </Link>
                </>
            }
            {isAdmin &&
                <AdminPage/>
            }
        </div>
    )
}

export default ProfilePage;