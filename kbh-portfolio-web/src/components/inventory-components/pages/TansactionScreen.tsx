import { useDebugValue, useEffect, useState } from "react";
import { getTransactionService } from "../../../services/transactionService";
import { getSalesReportService } from "../../../services/reportService";
import { addToBuffer, getFromBuffer, clearBuffer } from "../../../components/inventory-components/helpers/indexedDBHelper";


interface Transaction {
  product_name: string;
  product_code: string;
  payment_type: string;
  income: number;
  discount: number;
  amount: number;
  time:string
  status:string
}

const TransactionScreen = () => {


  const [transactions , setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
      console.log("transactions")
      const fetchTransactions = async () => {
        try {
          const fetchedTransactions = (await getTransactionService()).flatMap((product: any) => product.transactions);

          console.log("fetched", fetchedTransactions);

          const setTransactions_ = fetchedTransactions.map((transaction: any) => ({
              ...transaction,
              status: "COMPLETED"
          }));

          console.log("setTransactions", setTransactions_);
          if (setTransactions_ && setTransactions_.length > 0) { 
            setTransactions(setTransactions_);
          } else {
            console.warn('No products available');
          }
        } catch (error) {
          console.error("Error fetching products:", error);
      };
    }
      fetchTransactions();
    }, []);


    const salesReportGenerate = async () => {  
        const data = await getSalesReportService();
        console.log("Sales Report generated:", data); 
        alert('Generated the Report, Check Your Mail!')
    };


    const handleComplete = async (transaction: Transaction) => {
      console.log("Transaction add to buffer completed:", transaction);
    
      await addToBuffer(transaction);
    
      const buffer = await getFromBuffer();
      
      if (buffer.length > 1) {
        const transactionToSend = buffer[0];
        console.log("Sending to API:", transactionToSend);
    
        try {
       
          const response = await fetch('http://dfeffeeffeeeefefe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionToSend), 
          });
    
          if (response.ok) {
            console.log("Transaction sent to API successfully.");
            await clearBuffer();
          } else {
            console.error("Failed to send transaction to API.");
          }
        } catch (error) {
          console.error("Error sending transaction to API:", error);
        }
      }
      
      await addToBuffer(transaction);
    };

  return (
    <div className="font-sans bg-white p-5">
      <div className="flex justify-center mb-5">
        <button
          className="bg-orange-900 text-white px-6 py-2 rounded-full hover:bg-orange-600"
          onClick={() => {salesReportGenerate()}}
        >
         Sales Report
        </button>
      </div>

      <table className="w-full mt-5">
        <thead>
          <tr>
            <th className="p-2 text-center border-b-2 border-b-black">Product Code</th>
            <th className="p-2 text-center border-b-2 border-b-black">Product Name</th>
            <th className="p-2 text-center border-b-2 border-b-black">Amount</th>
            <th className="p-2 text-center border-b-2 border-b-black">Discount</th>
            <th className="p-2 text-center border-b-2 border-b-black">Income</th>
            <th className="p-2 text-center border-b-2 border-b-black">Payment Type</th>
            <th className="p-2 text-center border-b-2 border-b-black">Time</th>
            <th className="p-2 text-center border-b-2 border-b-black">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 &&    [...transactions]
            .sort((a, b) => {
              const [aHours, aMinutes] = a.time.split(':').map(Number);
              const [bHours, bMinutes] = b.time.split(':').map(Number);
              return bHours * 60 + bMinutes - (aHours * 60 + aMinutes); // Descending
            }).map((transaction, index) => (
            <tr key={index}>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.product_code}</td>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.product_name}</td>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.amount}</td>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.discount}</td>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.income}</td>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.payment_type}</td>
              <td className="p-2 text-center border-b-2 border-b-black">{transaction.time}</td>
              <td className="p-2 text-center border-b-2 border-b-black">
                <span
                  className={`${
                    transaction.status === 'COMPLETED'
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  } text-white px-4 py-1 text-[12px]`}
                  style={{ borderRadius: '15px' }}
                >
                  {transaction.status}
                </span>
              </td>
              <td className="p-2 text-center border-b-2 border-b-black">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-400 text-xs"
                      onClick={() => handleComplete(transaction)}
                    >
                      Complete
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionScreen;
