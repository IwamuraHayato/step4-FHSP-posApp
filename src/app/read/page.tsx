"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

const Page = () => {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPoints, setCustomerPoints] = useState<number | null>(null);
  const [inputPoints, setInputPoints] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);

  const dummyData: Record<string, { name: string; points: number }> = {
    user123: { name: "山田 太郎", points: 500 },
    user456: { name: "佐藤 花子", points: 300 },
  };

  const handleScan = (decodedText: string) => {
    setScanning(false);
    if (dummyData[decodedText]) {
      setCustomerName(dummyData[decodedText].name);
      setCustomerPoints(dummyData[decodedText].points);
      setResultMessage("");
    } else {
      setResultMessage("無効なQRコードです。");
    }
  };

  const handleError = (errorMessage: unknown) => {
    console.error(errorMessage);
    setScanning(false);
  };

  const handleTransaction = (type: "add" | "subtract") => {
    if (customerPoints === null) {
      setResultMessage("顧客情報がありません。");
      return;
    }
    if (type === "subtract" && inputPoints > customerPoints) {
      setResultMessage("ポイントが不足しています。");
      return;
    }
    const newPoints =
      type === "add" ? customerPoints + inputPoints : customerPoints - inputPoints;
    setCustomerPoints(newPoints);
    setResultMessage(`${inputPoints} ポイントを${type === "add" ? "加算" : "減算"}しました。`);
  };

  return (
    <div className="flex flex-col items-center p-4 w-[430px] h-[732px] mx-auto border rounded-lg shadow-md bg-white">
      {scanning && (
         <div className="w-[320px] h-[320px] border-gray-500 flex items-center justify-center">
        <Scanner
          onScan={(result: string | null) => {
            if (result) {
              handleScan(result);
            }
          }}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
          className="w-full h-full"
        />
       </div>
      )}

      <input type="text" className="w-full p-2 border my-2 text-center" value={customerName} readOnly placeholder="顧客名表示" />
      <input type="text" className="w-full p-2 border my-2 text-center" value={customerPoints ?? ""} readOnly placeholder="保有ポイント表示" />
      <input type="number" className="w-full p-2 border my-2 text-center" value={inputPoints} onChange={(e) => setInputPoints(Number(e.target.value))} placeholder="加算 or 減算ポイント入力欄" />
      <div className="flex w-full gap-2">
        <button className="flex-1 bg-green-500 text-white p-2 rounded-lg" onClick={() => handleTransaction("add")}>+</button>
        <button className="flex-1 bg-red-500 text-white p-2 rounded-lg" onClick={() => handleTransaction("subtract")}>-</button>
      </div>
      <input type="text" className="w-full p-2 border my-2 text-center" value={resultMessage} readOnly placeholder="処理結果表示" />
        <button
           className="mt-auto bg-blue-500 text-white p-2 w-full rounded-lg !mt-0"
           onClick={() => setScanning((prev) => !prev)}
           >
           スキャン
        </button>
    </div>
  );
};

export default Page;
