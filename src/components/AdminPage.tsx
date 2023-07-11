import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../base";

const AdminPage = () => {
    const [allOrders, setAllOrders] = useState<any>([]);

    async function getOrdersByOwner() {
        const ordersRef = collection(firestore, 'orders');
        const q = query(ordersRef, orderBy("mottatt", "desc"));
        const data = await getDocs(q);
        return data.docs;
      }

      useEffect(() => {
          const getAllOrders = async () => {
            const orders = await getOrdersByOwner();
            setAllOrders(orders);
          };
          getAllOrders();
        }, []);

    return(
        <> {allOrders.length !== 0 &&
                    <div className="prevContainer">
                        <h1>Alle registrerte bestillinger | Admin Mode</h1>
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
                                {allOrders.map((order: any) => (
                                <tr key={order.id}>
                                    <td>{order.data().mottatt}</td>
                                    <td>{order.data().leveringsdato}, {order.data().leveringstid}</td>
                                    <td>{order.data().leveringspris} kr</td>
                                    <td>{order.data().varer.join(", ")}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    }</>
    );
}
 export default AdminPage;