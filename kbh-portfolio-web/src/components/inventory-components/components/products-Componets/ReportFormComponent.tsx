import React, { useState } from "react";
import { postProductReportService, postOrderReportService } from "../../../../services/reportService";

interface ReportProps {
  selectedProduct: any;
  modalType: "send" | "order" | null;
  setModalType: React.Dispatch<React.SetStateAction<"send" | "order" | null>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<any>>;
  setResponse: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Report: React.FC<ReportProps> = ({
  selectedProduct,
  modalType,
  setModalType,
  setSelectedProduct,
  setResponse,
  setLoading,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null); // State for response message

  const handleConfirmReport = async () => {
    if (!selectedDate || !selectedProduct) {
      alert("Please select a date.");
      return;
    }

    const reportData = {
      starting_date: selectedDate,
      product_id: selectedProduct.id,
    };

    setLoadingState(true);

    let result;
    if (modalType === "send") {
      result = await postProductReportService(reportData);
    } else if (modalType === "order") {
      result = await postOrderReportService(reportData);
    }

    setLoadingState(false);

    // Update the response message after result
    if (result) {
      setResponseMessage(`${modalType === "send" ? "Send" : "Order"} Report successfully posted!`);
    } else {
      setResponseMessage("Error posting the report.");
    }

    // Set the response message to parent component
    setResponse(responseMessage);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedDate("");
    setModalType(null);
    setResponse(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center space-y-4">
        <h2 className="text-lg font-semibold">
          {modalType === "send" ? "Send Report" : "Order Report"} - Select a Date
        </h2>

        {/* Conditionally render the response message */}
        {responseMessage && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="text-green-500">{responseMessage}</p>
          </div>
        )}

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
        />

        <div className="flex justify-between gap-4">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full ${loadingState ? "relative" : ""}`}
            onClick={handleConfirmReport}
          >
            {loadingState ? (
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
